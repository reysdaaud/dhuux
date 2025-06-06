import { GenkitError, defineAction, z } from "@genkit-ai/core";
import { toJsonSchema } from "@genkit-ai/core/schema";
import { Document, DocumentDataSchema } from "./document.js";
import {
  Document as Document2,
  DocumentDataSchema as DocumentDataSchema2
} from "./document.js";
const RetrieverRequestSchema = z.object({
  query: DocumentDataSchema,
  options: z.any().optional()
});
const RetrieverResponseSchema = z.object({
  documents: z.array(DocumentDataSchema)
  // TODO: stats, etc.
});
const IndexerRequestSchema = z.object({
  documents: z.array(DocumentDataSchema),
  options: z.any().optional()
});
const RetrieverInfoSchema = z.object({
  label: z.string().optional(),
  /** Supported model capabilities. */
  supports: z.object({
    /** Model can process media as part of the prompt (multimodal input). */
    media: z.boolean().optional()
  }).optional()
});
function retrieverWithMetadata(retriever, configSchema) {
  const withMeta = retriever;
  withMeta.__configSchema = configSchema;
  return withMeta;
}
function indexerWithMetadata(indexer, configSchema) {
  const withMeta = indexer;
  withMeta.__configSchema = configSchema;
  return withMeta;
}
function defineRetriever(registry, options, runner) {
  const retriever = defineAction(
    registry,
    {
      actionType: "retriever",
      name: options.name,
      inputSchema: options.configSchema ? RetrieverRequestSchema.extend({
        options: options.configSchema.optional()
      }) : RetrieverRequestSchema,
      outputSchema: RetrieverResponseSchema,
      metadata: {
        type: "retriever",
        info: options.info,
        retriever: {
          customOptions: options.configSchema ? toJsonSchema({ schema: options.configSchema }) : void 0
        }
      }
    },
    (i) => runner(new Document(i.query), i.options)
  );
  const rwm = retrieverWithMetadata(
    retriever,
    options.configSchema
  );
  return rwm;
}
function defineIndexer(registry, options, runner) {
  const indexer = defineAction(
    registry,
    {
      actionType: "indexer",
      name: options.name,
      inputSchema: options.configSchema ? IndexerRequestSchema.extend({
        options: options.configSchema.optional()
      }) : IndexerRequestSchema,
      outputSchema: z.void(),
      metadata: {
        type: "indexer",
        embedderInfo: options.embedderInfo,
        indexer: {
          customOptions: options.configSchema ? toJsonSchema({ schema: options.configSchema }) : void 0
        }
      }
    },
    (i) => runner(
      i.documents.map((dd) => new Document(dd)),
      i.options
    )
  );
  const iwm = indexerWithMetadata(
    indexer,
    options.configSchema
  );
  return iwm;
}
async function retrieve(registry, params) {
  let retriever;
  if (typeof params.retriever === "string") {
    retriever = await registry.lookupAction(`/retriever/${params.retriever}`);
  } else if (Object.hasOwnProperty.call(params.retriever, "info")) {
    retriever = await registry.lookupAction(
      `/retriever/${params.retriever.name}`
    );
  } else {
    retriever = params.retriever;
  }
  if (!retriever) {
    throw new Error("Unable to resolve the retriever");
  }
  const response = await retriever({
    query: typeof params.query === "string" ? Document.fromText(params.query) : params.query,
    options: params.options
  });
  return response.documents.map((d) => new Document(d));
}
async function index(registry, params) {
  let indexer;
  if (typeof params.indexer === "string") {
    indexer = await registry.lookupAction(`/indexer/${params.indexer}`);
  } else if (Object.hasOwnProperty.call(params.indexer, "info")) {
    indexer = await registry.lookupAction(`/indexer/${params.indexer.name}`);
  } else {
    indexer = params.indexer;
  }
  if (!indexer) {
    throw new Error("Unable to utilize the provided indexer");
  }
  return await indexer({
    documents: params.documents,
    options: params.options
  });
}
const CommonRetrieverOptionsSchema = z.object({
  k: z.number().describe("Number of documents to retrieve").optional()
});
function retrieverRef(options) {
  return { ...options };
}
const IndexerInfoSchema = RetrieverInfoSchema;
function indexerRef(options) {
  return { ...options };
}
function itemToDocument(item, options) {
  if (!item)
    throw new GenkitError({
      status: "INVALID_ARGUMENT",
      message: `Items returned from simple retriever must be non-null.`
    });
  if (typeof item === "string") return Document.fromText(item);
  if (typeof options.content === "function") {
    const transformed = options.content(item);
    return typeof transformed === "string" ? Document.fromText(transformed) : new Document({ content: transformed });
  }
  if (typeof options.content === "string" && typeof item === "object")
    return Document.fromText(item[options.content]);
  throw new GenkitError({
    status: "INVALID_ARGUMENT",
    message: `Cannot convert item to document without content option. Item: ${JSON.stringify(item)}`
  });
}
function itemToMetadata(item, options) {
  if (typeof item === "string") return void 0;
  if (Array.isArray(options.metadata) && typeof item === "object") {
    const out = {};
    options.metadata.forEach((key) => out[key] = item[key]);
    return out;
  }
  if (typeof options.metadata === "function") return options.metadata(item);
  if (!options.metadata && typeof item === "object") {
    const out = { ...item };
    if (typeof options.content === "string") delete out[options.content];
    return out;
  }
  throw new GenkitError({
    status: "INVALID_ARGUMENT",
    message: `Unable to extract metadata from item with supplied options. Item: ${JSON.stringify(item)}`
  });
}
function defineSimpleRetriever(registry, options, handler) {
  return defineRetriever(
    registry,
    {
      name: options.name,
      configSchema: options.configSchema
    },
    async (query, config) => {
      const result = await handler(query, config);
      return {
        documents: result.map((item) => {
          const doc = itemToDocument(item, options);
          if (typeof item !== "string")
            doc.metadata = itemToMetadata(item, options);
          return doc;
        })
      };
    }
  );
}
export {
  CommonRetrieverOptionsSchema,
  Document2 as Document,
  DocumentDataSchema2 as DocumentDataSchema,
  IndexerInfoSchema,
  RetrieverInfoSchema,
  defineIndexer,
  defineRetriever,
  defineSimpleRetriever,
  index,
  indexerRef,
  retrieve,
  retrieverRef
};
//# sourceMappingURL=retriever.mjs.map