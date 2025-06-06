import {
  defineAction,
  GenkitError,
  getStreamingCallback,
  z
} from "@genkit-ai/core";
import { logger } from "@genkit-ai/core/logging";
import { toJsonSchema } from "@genkit-ai/core/schema";
import { performance } from "node:perf_hooks";
import {
  CustomPartSchema,
  DataPartSchema,
  DocumentDataSchema,
  MediaPartSchema,
  TextPartSchema,
  ToolRequestPartSchema,
  ToolResponsePartSchema
} from "./document.js";
import {
  augmentWithContext,
  simulateConstrainedGeneration,
  validateSupport
} from "./model/middleware.js";
import { defineGenerateAction } from "./generate/action.js";
const PartSchema = z.union([
  TextPartSchema,
  MediaPartSchema,
  ToolRequestPartSchema,
  ToolResponsePartSchema,
  DataPartSchema,
  CustomPartSchema
]);
const RoleSchema = z.enum(["system", "user", "model", "tool"]);
const MessageSchema = z.object({
  role: RoleSchema,
  content: z.array(PartSchema),
  metadata: z.record(z.unknown()).optional()
});
const ModelInfoSchema = z.object({
  /** Acceptable names for this model (e.g. different versions). */
  versions: z.array(z.string()).optional(),
  /** Friendly label for this model (e.g. "Google AI - Gemini Pro") */
  label: z.string().optional(),
  /** Model Specific configuration. */
  configSchema: z.record(z.any()).optional(),
  /** Supported model capabilities. */
  supports: z.object({
    /** Model can process historical messages passed with a prompt. */
    multiturn: z.boolean().optional(),
    /** Model can process media as part of the prompt (multimodal input). */
    media: z.boolean().optional(),
    /** Model can perform tool calls. */
    tools: z.boolean().optional(),
    /** Model can accept messages with role "system". */
    systemRole: z.boolean().optional(),
    /** Model can output this type of data. */
    output: z.array(z.string()).optional(),
    /** Model supports output in these content types. */
    contentType: z.array(z.string()).optional(),
    /** Model can natively support document-based context grounding. */
    context: z.boolean().optional(),
    /** Model can natively support constrained generation. */
    constrained: z.enum(["none", "all", "no-tools"]).optional(),
    /** Model supports controlling tool choice, e.g. forced tool calling. */
    toolChoice: z.boolean().optional()
  }).optional(),
  /** At which stage of development this model is.
   * - `featured` models are recommended for general use.
   * - `stable` models are well-tested and reliable.
   * - `unstable` models are experimental and may change.
   * - `legacy` models are no longer recommended for new projects.
   * - `deprecated` models are deprecated by the provider and may be removed in future versions.
   */
  stage: z.enum(["featured", "stable", "unstable", "legacy", "deprecated"]).optional()
});
const ToolDefinitionSchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: z.record(z.any()).describe("Valid JSON Schema representing the input of the tool.").nullish(),
  outputSchema: z.record(z.any()).describe("Valid JSON Schema describing the output of the tool.").nullish(),
  metadata: z.record(z.any()).describe("additional metadata for this tool definition").optional()
});
const GenerationCommonConfigDescriptions = {
  temperature: "Controls the degree of randomness in token selection. A lower value is good for a more predictable response. A higher value leads to more diverse or unexpected results.",
  maxOutputTokens: "The maximum number of tokens to include in the response.",
  topK: "The maximum number of tokens to consider when sampling.",
  topP: "Decides how many possible words to consider. A higher value means that the model looks at more possible words, even the less likely ones, which makes the generated text more diverse."
};
const GenerationCommonConfigSchema = z.object({
  version: z.string().describe(
    "A specific version of a model family, e.g. `gemini-2.0-flash` for the `googleai` family."
  ).optional(),
  temperature: z.number().describe(GenerationCommonConfigDescriptions.temperature).optional(),
  maxOutputTokens: z.number().describe(GenerationCommonConfigDescriptions.maxOutputTokens).optional(),
  topK: z.number().describe(GenerationCommonConfigDescriptions.topK).optional(),
  topP: z.number().describe(GenerationCommonConfigDescriptions.topP).optional(),
  stopSequences: z.array(z.string()).length(5).describe(
    "Set of character sequences (up to 5) that will stop output generation."
  ).optional()
});
const OutputConfigSchema = z.object({
  format: z.string().optional(),
  schema: z.record(z.any()).optional(),
  constrained: z.boolean().optional(),
  contentType: z.string().optional()
});
const ModelRequestSchema = z.object({
  messages: z.array(MessageSchema),
  config: z.any().optional(),
  tools: z.array(ToolDefinitionSchema).optional(),
  toolChoice: z.enum(["auto", "required", "none"]).optional(),
  output: OutputConfigSchema.optional(),
  docs: z.array(DocumentDataSchema).optional()
});
const GenerateRequestSchema = ModelRequestSchema.extend({
  /** @deprecated All responses now return a single candidate. This will always be `undefined`. */
  candidates: z.number().optional()
});
const GenerationUsageSchema = z.object({
  inputTokens: z.number().optional(),
  outputTokens: z.number().optional(),
  totalTokens: z.number().optional(),
  inputCharacters: z.number().optional(),
  outputCharacters: z.number().optional(),
  inputImages: z.number().optional(),
  outputImages: z.number().optional(),
  inputVideos: z.number().optional(),
  outputVideos: z.number().optional(),
  inputAudioFiles: z.number().optional(),
  outputAudioFiles: z.number().optional(),
  custom: z.record(z.number()).optional()
});
const FinishReasonSchema = z.enum([
  "stop",
  "length",
  "blocked",
  "interrupted",
  "other",
  "unknown"
]);
const CandidateSchema = z.object({
  index: z.number(),
  message: MessageSchema,
  usage: GenerationUsageSchema.optional(),
  finishReason: FinishReasonSchema,
  finishMessage: z.string().optional(),
  custom: z.unknown()
});
const CandidateErrorSchema = z.object({
  index: z.number(),
  code: z.enum(["blocked", "other", "unknown"]),
  message: z.string().optional()
});
const ModelResponseSchema = z.object({
  message: MessageSchema.optional(),
  finishReason: FinishReasonSchema,
  finishMessage: z.string().optional(),
  latencyMs: z.number().optional(),
  usage: GenerationUsageSchema.optional(),
  /** @deprecated use `raw` instead */
  custom: z.unknown(),
  raw: z.unknown(),
  request: GenerateRequestSchema.optional()
});
const GenerateResponseSchema = ModelResponseSchema.extend({
  /** @deprecated All responses now return a single candidate. Only the first candidate will be used if supplied. Return `message`, `finishReason`, and `finishMessage` instead. */
  candidates: z.array(CandidateSchema).optional(),
  finishReason: FinishReasonSchema.optional()
});
const ModelResponseChunkSchema = z.object({
  role: RoleSchema.optional(),
  /** index of the message this chunk belongs to. */
  index: z.number().optional(),
  /** The chunk of content to stream right now. */
  content: z.array(PartSchema),
  /** Model-specific extra information attached to this chunk. */
  custom: z.unknown().optional(),
  /** If true, the chunk includes all data from previous chunks. Otherwise, considered to be incremental. */
  aggregated: z.boolean().optional()
});
const GenerateResponseChunkSchema = ModelResponseChunkSchema;
function defineModel(registry, options, runner) {
  const label = options.label || options.name;
  const middleware = [
    ...options.use || [],
    validateSupport(options)
  ];
  if (!options?.supports?.context) middleware.push(augmentWithContext());
  const constratedSimulator = simulateConstrainedGeneration();
  middleware.push((req, next) => {
    if (!options?.supports?.constrained || options?.supports?.constrained === "none" || options?.supports?.constrained === "no-tools" && (req.tools?.length ?? 0) > 0) {
      return constratedSimulator(req, next);
    }
    return next(req);
  });
  const act = defineAction(
    registry,
    {
      actionType: "model",
      name: options.name,
      description: label,
      inputSchema: GenerateRequestSchema,
      outputSchema: GenerateResponseSchema,
      metadata: {
        model: {
          label,
          customOptions: options.configSchema ? toJsonSchema({ schema: options.configSchema }) : void 0,
          versions: options.versions,
          supports: options.supports
        }
      },
      use: middleware
    },
    (input) => {
      const startTimeMs = performance.now();
      return runner(input, getStreamingCallback(registry)).then((response) => {
        const timedResponse = {
          ...response,
          latencyMs: performance.now() - startTimeMs
        };
        return timedResponse;
      });
    }
  );
  Object.assign(act, {
    __configSchema: options.configSchema || z.unknown()
  });
  return act;
}
function modelRef(options) {
  const ref = { ...options };
  ref.withConfig = (cfg) => {
    return modelRef({
      ...options,
      config: cfg
    });
  };
  ref.withVersion = (version) => {
    return modelRef({
      ...options,
      version
    });
  };
  return ref;
}
function getBasicUsageStats(input, response) {
  const inputCounts = getPartCounts(input.flatMap((md) => md.content));
  const outputCounts = getPartCounts(
    Array.isArray(response) ? response.flatMap((c) => c.message.content) : response.content
  );
  return {
    inputCharacters: inputCounts.characters,
    inputImages: inputCounts.images,
    inputVideos: inputCounts.videos,
    inputAudioFiles: inputCounts.audio,
    outputCharacters: outputCounts.characters,
    outputImages: outputCounts.images,
    outputVideos: outputCounts.videos,
    outputAudioFiles: outputCounts.audio
  };
}
function getPartCounts(parts) {
  return parts.reduce(
    (counts, part) => {
      const isImage = part.media?.contentType?.startsWith("image") || part.media?.url?.startsWith("data:image");
      const isVideo = part.media?.contentType?.startsWith("video") || part.media?.url?.startsWith("data:video");
      const isAudio = part.media?.contentType?.startsWith("audio") || part.media?.url?.startsWith("data:audio");
      return {
        characters: counts.characters + (part.text?.length || 0),
        images: counts.images + (isImage ? 1 : 0),
        videos: counts.videos + (isVideo ? 1 : 0),
        audio: counts.audio + (isAudio ? 1 : 0)
      };
    },
    { characters: 0, images: 0, videos: 0, audio: 0 }
  );
}
async function resolveModel(registry, model, options) {
  let out;
  let modelId;
  if (!model) {
    model = await registry.lookupValue("defaultModel", "defaultModel");
  }
  if (!model) {
    throw new GenkitError({
      status: "INVALID_ARGUMENT",
      message: "Must supply a `model` to `generate()` calls."
    });
  }
  if (typeof model === "string") {
    modelId = model;
    out = { modelAction: await registry.lookupAction(`/model/${model}`) };
  } else if (model.hasOwnProperty("__action")) {
    modelId = model.__action.name;
    out = { modelAction: model };
  } else {
    const ref = model;
    modelId = ref.name;
    out = {
      modelAction: await registry.lookupAction(
        `/model/${ref.name}`
      ),
      config: {
        ...ref.config
      },
      version: ref.version
    };
  }
  if (!out.modelAction) {
    throw new GenkitError({
      status: "NOT_FOUND",
      message: `Model '${modelId}' not found`
    });
  }
  if (options?.warnDeprecated && out.modelAction.__action.metadata?.model?.stage === "deprecated") {
    logger.warn(
      `Model '${out.modelAction.__action.name}' is deprecated and may be removed in a future release.`
    );
  }
  return out;
}
const GenerateActionOutputConfig = z.object({
  format: z.string().optional(),
  contentType: z.string().optional(),
  instructions: z.union([z.boolean(), z.string()]).optional(),
  jsonSchema: z.any().optional(),
  constrained: z.boolean().optional()
});
const GenerateActionOptionsSchema = z.object({
  /** A model name (e.g. `vertexai/gemini-1.0-pro`). */
  model: z.string(),
  /** Retrieved documents to be used as context for this generation. */
  docs: z.array(DocumentDataSchema).optional(),
  /** Conversation history for multi-turn prompting when supported by the underlying model. */
  messages: z.array(MessageSchema),
  /** List of registered tool names for this generation if supported by the underlying model. */
  tools: z.array(z.string()).optional(),
  /** Tool calling mode. `auto` lets the model decide whether to use tools, `required` forces the model to choose a tool, and `none` forces the model not to use any tools. Defaults to `auto`.  */
  toolChoice: z.enum(["auto", "required", "none"]).optional(),
  /** Configuration for the generation request. */
  config: z.any().optional(),
  /** Configuration for the desired output of the request. Defaults to the model's default output if unspecified. */
  output: GenerateActionOutputConfig.optional(),
  /** Options for resuming an interrupted generation. */
  resume: z.object({
    respond: z.array(ToolResponsePartSchema).optional(),
    restart: z.array(ToolRequestPartSchema).optional(),
    metadata: z.record(z.any()).optional()
  }).optional(),
  /** When true, return tool calls for manual processing instead of automatically resolving them. */
  returnToolRequests: z.boolean().optional(),
  /** Maximum number of tool call iterations that can be performed in a single generate call (default 5). */
  maxTurns: z.number().optional()
});
export {
  CandidateErrorSchema,
  CandidateSchema,
  CustomPartSchema,
  DataPartSchema,
  FinishReasonSchema,
  GenerateActionOptionsSchema,
  GenerateActionOutputConfig,
  GenerateRequestSchema,
  GenerateResponseChunkSchema,
  GenerateResponseSchema,
  GenerationCommonConfigDescriptions,
  GenerationCommonConfigSchema,
  GenerationUsageSchema,
  MediaPartSchema,
  MessageSchema,
  ModelInfoSchema,
  ModelRequestSchema,
  ModelResponseChunkSchema,
  ModelResponseSchema,
  OutputConfigSchema,
  PartSchema,
  RoleSchema,
  TextPartSchema,
  ToolDefinitionSchema,
  ToolRequestPartSchema,
  ToolResponsePartSchema,
  defineGenerateAction,
  defineModel,
  getBasicUsageStats,
  modelRef,
  resolveModel,
  simulateConstrainedGeneration
};
//# sourceMappingURL=model.mjs.map