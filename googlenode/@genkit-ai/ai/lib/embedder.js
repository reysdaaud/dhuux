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
var embedder_exports = {};
__export(embedder_exports, {
  EmbedderInfoSchema: () => EmbedderInfoSchema,
  EmbeddingSchema: () => EmbeddingSchema,
  defineEmbedder: () => defineEmbedder,
  embed: () => embed,
  embedMany: () => embedMany,
  embedderRef: () => embedderRef
});
module.exports = __toCommonJS(embedder_exports);
var import_core = require("@genkit-ai/core");
var import_schema = require("@genkit-ai/core/schema");
var import_document = require("./document.js");
const EmbeddingSchema = import_core.z.object({
  embedding: import_core.z.array(import_core.z.number()),
  metadata: import_core.z.record(import_core.z.string(), import_core.z.unknown()).optional()
});
const EmbedRequestSchema = import_core.z.object({
  input: import_core.z.array(import_document.DocumentDataSchema),
  options: import_core.z.any().optional()
});
const EmbedResponseSchema = import_core.z.object({
  embeddings: import_core.z.array(EmbeddingSchema)
  // TODO: stats, etc.
});
function withMetadata(embedder, configSchema) {
  const withMeta = embedder;
  withMeta.__configSchema = configSchema;
  return withMeta;
}
function defineEmbedder(registry, options, runner) {
  const embedder = (0, import_core.defineAction)(
    registry,
    {
      actionType: "embedder",
      name: options.name,
      inputSchema: options.configSchema ? EmbedRequestSchema.extend({
        options: options.configSchema.optional()
      }) : EmbedRequestSchema,
      outputSchema: EmbedResponseSchema,
      metadata: {
        type: "embedder",
        info: options.info,
        embedder: {
          customOptions: options.configSchema ? (0, import_schema.toJsonSchema)({ schema: options.configSchema }) : void 0
        }
      }
    },
    (i) => runner(
      i.input.map((dd) => new import_document.Document(dd)),
      i.options
    )
  );
  const ewm = withMetadata(
    embedder,
    options.configSchema
  );
  return ewm;
}
async function embed(registry, params) {
  let embedder = await resolveEmbedder(registry, params);
  if (!embedder.embedderAction) {
    let embedderId;
    if (typeof params.embedder === "string") {
      embedderId = params.embedder;
    } else if (params.embedder?.__action?.name) {
      embedderId = params.embedder.__action.name;
    } else {
      embedderId = params.embedder.name;
    }
    throw new Error(`Unable to resolve embedder ${embedderId}`);
  }
  const response = await embedder.embedderAction({
    input: typeof params.content === "string" ? [import_document.Document.fromText(params.content, params.metadata)] : [params.content],
    options: {
      version: embedder.version,
      ...embedder.config,
      ...params.options
    }
  });
  return response.embeddings;
}
async function resolveEmbedder(registry, params) {
  if (typeof params.embedder === "string") {
    return {
      embedderAction: await registry.lookupAction(
        `/embedder/${params.embedder}`
      )
    };
  } else if (Object.hasOwnProperty.call(params.embedder, "__action")) {
    return {
      embedderAction: params.embedder
    };
  } else if (Object.hasOwnProperty.call(params.embedder, "name")) {
    const ref = params.embedder;
    return {
      embedderAction: await registry.lookupAction(
        `/embedder/${params.embedder.name}`
      ),
      config: {
        ...ref.config
      },
      version: ref.version
    };
  }
  throw new Error(`failed to resolve embedder ${params.embedder}`);
}
async function embedMany(registry, params) {
  let embedder;
  if (typeof params.embedder === "string") {
    embedder = await registry.lookupAction(`/embedder/${params.embedder}`);
  } else if (Object.hasOwnProperty.call(params.embedder, "info")) {
    embedder = await registry.lookupAction(
      `/embedder/${params.embedder.name}`
    );
  } else {
    embedder = params.embedder;
  }
  if (!embedder) {
    throw new Error("Unable to utilize the provided embedder");
  }
  const response = await embedder({
    input: params.content.map(
      (i) => typeof i === "string" ? import_document.Document.fromText(i, params.metadata) : i
    ),
    options: params.options
  });
  return response.embeddings;
}
const EmbedderInfoSchema = import_core.z.object({
  /** Friendly label for this model (e.g. "Google AI - Gemini Pro") */
  label: import_core.z.string().optional(),
  /** Supported model capabilities. */
  supports: import_core.z.object({
    /** Model can input this type of data. */
    input: import_core.z.array(import_core.z.enum(["text", "image", "video"])).optional(),
    /** Model can support multiple languages */
    multilingual: import_core.z.boolean().optional()
  }).optional(),
  /** Embedding dimension */
  dimensions: import_core.z.number().optional()
});
function embedderRef(options) {
  return { ...options };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmbedderInfoSchema,
  EmbeddingSchema,
  defineEmbedder,
  embed,
  embedMany,
  embedderRef
});
//# sourceMappingURL=embedder.js.map