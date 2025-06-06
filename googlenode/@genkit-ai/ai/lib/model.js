"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var model_exports = {};
__export(model_exports, {
  CandidateErrorSchema: () => CandidateErrorSchema,
  CandidateSchema: () => CandidateSchema,
  CustomPartSchema: () => import_document.CustomPartSchema,
  DataPartSchema: () => import_document.DataPartSchema,
  FinishReasonSchema: () => FinishReasonSchema,
  GenerateActionOptionsSchema: () => GenerateActionOptionsSchema,
  GenerateActionOutputConfig: () => GenerateActionOutputConfig,
  GenerateRequestSchema: () => GenerateRequestSchema,
  GenerateResponseChunkSchema: () => GenerateResponseChunkSchema,
  GenerateResponseSchema: () => GenerateResponseSchema,
  GenerationCommonConfigDescriptions: () => GenerationCommonConfigDescriptions,
  GenerationCommonConfigSchema: () => GenerationCommonConfigSchema,
  GenerationUsageSchema: () => GenerationUsageSchema,
  MediaPartSchema: () => import_document.MediaPartSchema,
  MessageSchema: () => MessageSchema,
  ModelInfoSchema: () => ModelInfoSchema,
  ModelRequestSchema: () => ModelRequestSchema,
  ModelResponseChunkSchema: () => ModelResponseChunkSchema,
  ModelResponseSchema: () => ModelResponseSchema,
  OutputConfigSchema: () => OutputConfigSchema,
  PartSchema: () => PartSchema,
  RoleSchema: () => RoleSchema,
  TextPartSchema: () => import_document.TextPartSchema,
  ToolDefinitionSchema: () => ToolDefinitionSchema,
  ToolRequestPartSchema: () => import_document.ToolRequestPartSchema,
  ToolResponsePartSchema: () => import_document.ToolResponsePartSchema,
  defineGenerateAction: () => import_action.defineGenerateAction,
  defineModel: () => defineModel,
  getBasicUsageStats: () => getBasicUsageStats,
  modelRef: () => modelRef,
  resolveModel: () => resolveModel,
  simulateConstrainedGeneration: () => import_middleware.simulateConstrainedGeneration
});
module.exports = __toCommonJS(model_exports);
var import_core = require("@genkit-ai/core");
var import_logging = require("@genkit-ai/core/logging");
var import_schema = require("@genkit-ai/core/schema");
var import_node_perf_hooks = require("node:perf_hooks");
var import_document = require("./document.js");
var import_middleware = require("./model/middleware.js");
var import_action = require("./generate/action.js");
const PartSchema = import_core.z.union([
  import_document.TextPartSchema,
  import_document.MediaPartSchema,
  import_document.ToolRequestPartSchema,
  import_document.ToolResponsePartSchema,
  import_document.DataPartSchema,
  import_document.CustomPartSchema
]);
const RoleSchema = import_core.z.enum(["system", "user", "model", "tool"]);
const MessageSchema = import_core.z.object({
  role: RoleSchema,
  content: import_core.z.array(PartSchema),
  metadata: import_core.z.record(import_core.z.unknown()).optional()
});
const ModelInfoSchema = import_core.z.object({
  /** Acceptable names for this model (e.g. different versions). */
  versions: import_core.z.array(import_core.z.string()).optional(),
  /** Friendly label for this model (e.g. "Google AI - Gemini Pro") */
  label: import_core.z.string().optional(),
  /** Model Specific configuration. */
  configSchema: import_core.z.record(import_core.z.any()).optional(),
  /** Supported model capabilities. */
  supports: import_core.z.object({
    /** Model can process historical messages passed with a prompt. */
    multiturn: import_core.z.boolean().optional(),
    /** Model can process media as part of the prompt (multimodal input). */
    media: import_core.z.boolean().optional(),
    /** Model can perform tool calls. */
    tools: import_core.z.boolean().optional(),
    /** Model can accept messages with role "system". */
    systemRole: import_core.z.boolean().optional(),
    /** Model can output this type of data. */
    output: import_core.z.array(import_core.z.string()).optional(),
    /** Model supports output in these content types. */
    contentType: import_core.z.array(import_core.z.string()).optional(),
    /** Model can natively support document-based context grounding. */
    context: import_core.z.boolean().optional(),
    /** Model can natively support constrained generation. */
    constrained: import_core.z.enum(["none", "all", "no-tools"]).optional(),
    /** Model supports controlling tool choice, e.g. forced tool calling. */
    toolChoice: import_core.z.boolean().optional()
  }).optional(),
  /** At which stage of development this model is.
   * - `featured` models are recommended for general use.
   * - `stable` models are well-tested and reliable.
   * - `unstable` models are experimental and may change.
   * - `legacy` models are no longer recommended for new projects.
   * - `deprecated` models are deprecated by the provider and may be removed in future versions.
   */
  stage: import_core.z.enum(["featured", "stable", "unstable", "legacy", "deprecated"]).optional()
});
const ToolDefinitionSchema = import_core.z.object({
  name: import_core.z.string(),
  description: import_core.z.string(),
  inputSchema: import_core.z.record(import_core.z.any()).describe("Valid JSON Schema representing the input of the tool.").nullish(),
  outputSchema: import_core.z.record(import_core.z.any()).describe("Valid JSON Schema describing the output of the tool.").nullish(),
  metadata: import_core.z.record(import_core.z.any()).describe("additional metadata for this tool definition").optional()
});
const GenerationCommonConfigDescriptions = {
  temperature: "Controls the degree of randomness in token selection. A lower value is good for a more predictable response. A higher value leads to more diverse or unexpected results.",
  maxOutputTokens: "The maximum number of tokens to include in the response.",
  topK: "The maximum number of tokens to consider when sampling.",
  topP: "Decides how many possible words to consider. A higher value means that the model looks at more possible words, even the less likely ones, which makes the generated text more diverse."
};
const GenerationCommonConfigSchema = import_core.z.object({
  version: import_core.z.string().describe(
    "A specific version of a model family, e.g. `gemini-2.0-flash` for the `googleai` family."
  ).optional(),
  temperature: import_core.z.number().describe(GenerationCommonConfigDescriptions.temperature).optional(),
  maxOutputTokens: import_core.z.number().describe(GenerationCommonConfigDescriptions.maxOutputTokens).optional(),
  topK: import_core.z.number().describe(GenerationCommonConfigDescriptions.topK).optional(),
  topP: import_core.z.number().describe(GenerationCommonConfigDescriptions.topP).optional(),
  stopSequences: import_core.z.array(import_core.z.string()).length(5).describe(
    "Set of character sequences (up to 5) that will stop output generation."
  ).optional()
});
const OutputConfigSchema = import_core.z.object({
  format: import_core.z.string().optional(),
  schema: import_core.z.record(import_core.z.any()).optional(),
  constrained: import_core.z.boolean().optional(),
  contentType: import_core.z.string().optional()
});
const ModelRequestSchema = import_core.z.object({
  messages: import_core.z.array(MessageSchema),
  config: import_core.z.any().optional(),
  tools: import_core.z.array(ToolDefinitionSchema).optional(),
  toolChoice: import_core.z.enum(["auto", "required", "none"]).optional(),
  output: OutputConfigSchema.optional(),
  docs: import_core.z.array(import_document.DocumentDataSchema).optional()
});
const GenerateRequestSchema = ModelRequestSchema.extend({
  /** @deprecated All responses now return a single candidate. This will always be `undefined`. */
  candidates: import_core.z.number().optional()
});
const GenerationUsageSchema = import_core.z.object({
  inputTokens: import_core.z.number().optional(),
  outputTokens: import_core.z.number().optional(),
  totalTokens: import_core.z.number().optional(),
  inputCharacters: import_core.z.number().optional(),
  outputCharacters: import_core.z.number().optional(),
  inputImages: import_core.z.number().optional(),
  outputImages: import_core.z.number().optional(),
  inputVideos: import_core.z.number().optional(),
  outputVideos: import_core.z.number().optional(),
  inputAudioFiles: import_core.z.number().optional(),
  outputAudioFiles: import_core.z.number().optional(),
  custom: import_core.z.record(import_core.z.number()).optional()
});
const FinishReasonSchema = import_core.z.enum([
  "stop",
  "length",
  "blocked",
  "interrupted",
  "other",
  "unknown"
]);
const CandidateSchema = import_core.z.object({
  index: import_core.z.number(),
  message: MessageSchema,
  usage: GenerationUsageSchema.optional(),
  finishReason: FinishReasonSchema,
  finishMessage: import_core.z.string().optional(),
  custom: import_core.z.unknown()
});
const CandidateErrorSchema = import_core.z.object({
  index: import_core.z.number(),
  code: import_core.z.enum(["blocked", "other", "unknown"]),
  message: import_core.z.string().optional()
});
const ModelResponseSchema = import_core.z.object({
  message: MessageSchema.optional(),
  finishReason: FinishReasonSchema,
  finishMessage: import_core.z.string().optional(),
  latencyMs: import_core.z.number().optional(),
  usage: GenerationUsageSchema.optional(),
  /** @deprecated use `raw` instead */
  custom: import_core.z.unknown(),
  raw: import_core.z.unknown(),
  request: GenerateRequestSchema.optional()
});
const GenerateResponseSchema = ModelResponseSchema.extend({
  /** @deprecated All responses now return a single candidate. Only the first candidate will be used if supplied. Return `message`, `finishReason`, and `finishMessage` instead. */
  candidates: import_core.z.array(CandidateSchema).optional(),
  finishReason: FinishReasonSchema.optional()
});
const ModelResponseChunkSchema = import_core.z.object({
  role: RoleSchema.optional(),
  /** index of the message this chunk belongs to. */
  index: import_core.z.number().optional(),
  /** The chunk of content to stream right now. */
  content: import_core.z.array(PartSchema),
  /** Model-specific extra information attached to this chunk. */
  custom: import_core.z.unknown().optional(),
  /** If true, the chunk includes all data from previous chunks. Otherwise, considered to be incremental. */
  aggregated: import_core.z.boolean().optional()
});
const GenerateResponseChunkSchema = ModelResponseChunkSchema;
function defineModel(registry, options, runner) {
  const label = options.label || options.name;
  const middleware = [
    ...options.use || [],
    (0, import_middleware.validateSupport)(options)
  ];
  if (!options?.supports?.context) middleware.push((0, import_middleware.augmentWithContext)());
  const constratedSimulator = (0, import_middleware.simulateConstrainedGeneration)();
  middleware.push((req, next) => {
    if (!options?.supports?.constrained || options?.supports?.constrained === "none" || options?.supports?.constrained === "no-tools" && (req.tools?.length ?? 0) > 0) {
      return constratedSimulator(req, next);
    }
    return next(req);
  });
  const act = (0, import_core.defineAction)(
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
          customOptions: options.configSchema ? (0, import_schema.toJsonSchema)({ schema: options.configSchema }) : void 0,
          versions: options.versions,
          supports: options.supports
        }
      },
      use: middleware
    },
    (input) => {
      const startTimeMs = import_node_perf_hooks.performance.now();
      return runner(input, (0, import_core.getStreamingCallback)(registry)).then((response) => {
        const timedResponse = {
          ...response,
          latencyMs: import_node_perf_hooks.performance.now() - startTimeMs
        };
        return timedResponse;
      });
    }
  );
  Object.assign(act, {
    __configSchema: options.configSchema || import_core.z.unknown()
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
    throw new import_core.GenkitError({
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
    throw new import_core.GenkitError({
      status: "NOT_FOUND",
      message: `Model '${modelId}' not found`
    });
  }
  if (options?.warnDeprecated && out.modelAction.__action.metadata?.model?.stage === "deprecated") {
    import_logging.logger.warn(
      `Model '${out.modelAction.__action.name}' is deprecated and may be removed in a future release.`
    );
  }
  return out;
}
const GenerateActionOutputConfig = import_core.z.object({
  format: import_core.z.string().optional(),
  contentType: import_core.z.string().optional(),
  instructions: import_core.z.union([import_core.z.boolean(), import_core.z.string()]).optional(),
  jsonSchema: import_core.z.any().optional(),
  constrained: import_core.z.boolean().optional()
});
const GenerateActionOptionsSchema = import_core.z.object({
  /** A model name (e.g. `vertexai/gemini-1.0-pro`). */
  model: import_core.z.string(),
  /** Retrieved documents to be used as context for this generation. */
  docs: import_core.z.array(import_document.DocumentDataSchema).optional(),
  /** Conversation history for multi-turn prompting when supported by the underlying model. */
  messages: import_core.z.array(MessageSchema),
  /** List of registered tool names for this generation if supported by the underlying model. */
  tools: import_core.z.array(import_core.z.string()).optional(),
  /** Tool calling mode. `auto` lets the model decide whether to use tools, `required` forces the model to choose a tool, and `none` forces the model not to use any tools. Defaults to `auto`.  */
  toolChoice: import_core.z.enum(["auto", "required", "none"]).optional(),
  /** Configuration for the generation request. */
  config: import_core.z.any().optional(),
  /** Configuration for the desired output of the request. Defaults to the model's default output if unspecified. */
  output: GenerateActionOutputConfig.optional(),
  /** Options for resuming an interrupted generation. */
  resume: import_core.z.object({
    respond: import_core.z.array(import_document.ToolResponsePartSchema).optional(),
    restart: import_core.z.array(import_document.ToolRequestPartSchema).optional(),
    metadata: import_core.z.record(import_core.z.any()).optional()
  }).optional(),
  /** When true, return tool calls for manual processing instead of automatically resolving them. */
  returnToolRequests: import_core.z.boolean().optional(),
  /** Maximum number of tool call iterations that can be performed in a single generate call (default 5). */
  maxTurns: import_core.z.number().optional()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=model.js.map