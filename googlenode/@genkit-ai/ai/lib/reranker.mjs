import { defineAction, z } from "@genkit-ai/core";
import { toJsonSchema } from "@genkit-ai/core/schema";
import { PartSchema } from "./document.js";
import { Document, DocumentDataSchema } from "./retriever.js";
const RankedDocumentMetadataSchema = z.object({
  score: z.number()
  // Enforces that 'score' must be a number
}).passthrough();
const RankedDocumentDataSchema = z.object({
  content: z.array(PartSchema),
  metadata: RankedDocumentMetadataSchema
});
class RankedDocument extends Document {
  content;
  metadata;
  constructor(data) {
    super(data);
    this.content = data.content;
    this.metadata = data.metadata;
  }
  /**
   * Returns the score of the document.
   * @returns The score of the document.
   */
  score() {
    return this.metadata.score;
  }
}
const RerankerRequestSchema = z.object({
  query: DocumentDataSchema,
  documents: z.array(DocumentDataSchema),
  options: z.any().optional()
});
const RerankerResponseSchema = z.object({
  documents: z.array(RankedDocumentDataSchema)
});
const RerankerInfoSchema = z.object({
  label: z.string().optional(),
  /** Supported model capabilities. */
  supports: z.object({
    /** Model can process media as part of the prompt (multimodal input). */
    media: z.boolean().optional()
  }).optional()
});
function rerankerWithMetadata(reranker, configSchema) {
  const withMeta = reranker;
  withMeta.__configSchema = configSchema;
  return withMeta;
}
function defineReranker(registry, options, runner) {
  const reranker = defineAction(
    registry,
    {
      actionType: "reranker",
      name: options.name,
      inputSchema: options.configSchema ? RerankerRequestSchema.extend({
        options: options.configSchema.optional()
      }) : RerankerRequestSchema,
      outputSchema: RerankerResponseSchema,
      metadata: {
        type: "reranker",
        info: options.info,
        reranker: {
          customOptions: options.configSchema ? toJsonSchema({ schema: options.configSchema }) : void 0
        }
      }
    },
    (i) => runner(
      new Document(i.query),
      i.documents.map((d) => new Document(d)),
      i.options
    )
  );
  const rwm = rerankerWithMetadata(
    reranker,
    options.configSchema
  );
  return rwm;
}
async function rerank(registry, params) {
  let reranker;
  if (typeof params.reranker === "string") {
    reranker = await registry.lookupAction(`/reranker/${params.reranker}`);
  } else if (Object.hasOwnProperty.call(params.reranker, "info")) {
    reranker = await registry.lookupAction(`/reranker/${params.reranker.name}`);
  } else {
    reranker = params.reranker;
  }
  if (!reranker) {
    throw new Error("Unable to resolve the reranker");
  }
  const response = await reranker({
    query: typeof params.query === "string" ? Document.fromText(params.query) : params.query,
    documents: params.documents,
    options: params.options
  });
  return response.documents.map((d) => new RankedDocument(d));
}
const CommonRerankerOptionsSchema = z.object({
  k: z.number().describe("Number of documents to rerank").optional()
});
function rerankerRef(options) {
  return { ...options };
}
export {
  CommonRerankerOptionsSchema,
  RankedDocument,
  RankedDocumentDataSchema,
  RankedDocumentMetadataSchema,
  RerankerInfoSchema,
  defineReranker,
  rerank,
  rerankerRef
};
//# sourceMappingURL=reranker.mjs.map