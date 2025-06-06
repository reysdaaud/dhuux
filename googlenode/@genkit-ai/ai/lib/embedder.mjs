import { defineAction, z } from "@genkit-ai/core";
import { toJsonSchema } from "@genkit-ai/core/schema";
import { Document, DocumentDataSchema } from "./document.js";
const EmbeddingSchema = z.object({
  embedding: z.array(z.number()),
  metadata: z.record(z.string(), z.unknown()).optional()
});
const EmbedRequestSchema = z.object({
  input: z.array(DocumentDataSchema),
  options: z.any().optional()
});
const EmbedResponseSchema = z.object({
  embeddings: z.array(EmbeddingSchema)
  // TODO: stats, etc.
});
function withMetadata(embedder, configSchema) {
  const withMeta = embedder;
  withMeta.__configSchema = configSchema;
  return withMeta;
}
function defineEmbedder(registry, options, runner) {
  const embedder = defineAction(
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
          customOptions: options.configSchema ? toJsonSchema({ schema: options.configSchema }) : void 0
        }
      }
    },
    (i) => runner(
      i.input.map((dd) => new Document(dd)),
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
    input: typeof params.content === "string" ? [Document.fromText(params.content, params.metadata)] : [params.content],
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
      (i) => typeof i === "string" ? Document.fromText(i, params.metadata) : i
    ),
    options: params.options
  });
  return response.embeddings;
}
const EmbedderInfoSchema = z.object({
  /** Friendly label for this model (e.g. "Google AI - Gemini Pro") */
  label: z.string().optional(),
  /** Supported model capabilities. */
  supports: z.object({
    /** Model can input this type of data. */
    input: z.array(z.enum(["text", "image", "video"])).optional(),
    /** Model can support multiple languages */
    multilingual: z.boolean().optional()
  }).optional(),
  /** Embedding dimension */
  dimensions: z.number().optional()
});
function embedderRef(options) {
  return { ...options };
}
export {
  EmbedderInfoSchema,
  EmbeddingSchema,
  defineEmbedder,
  embed,
  embedMany,
  embedderRef
};
//# sourceMappingURL=embedder.mjs.map