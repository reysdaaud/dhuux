import { z } from "zod";
const PathMetadataSchema = z.object({
  path: z.string(),
  status: z.string(),
  error: z.string().optional(),
  latency: z.number()
});
const TraceMetadataSchema = z.object({
  featureName: z.string().optional(),
  paths: z.set(PathMetadataSchema).optional(),
  timestamp: z.number()
});
const SpanMetadataSchema = z.object({
  name: z.string(),
  state: z.enum(["success", "error"]).optional(),
  input: z.any().optional(),
  output: z.any().optional(),
  isRoot: z.boolean().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  path: z.string().optional()
});
const SpanStatusSchema = z.object({
  code: z.number(),
  message: z.string().optional()
});
const TimeEventSchema = z.object({
  time: z.number(),
  annotation: z.object({
    attributes: z.record(z.string(), z.any()),
    description: z.string()
  })
});
const SpanContextSchema = z.object({
  traceId: z.string(),
  spanId: z.string(),
  isRemote: z.boolean().optional(),
  traceFlags: z.number()
});
const LinkSchema = z.object({
  context: SpanContextSchema.optional(),
  attributes: z.record(z.string(), z.any()).optional(),
  droppedAttributesCount: z.number().optional()
});
const InstrumentationLibrarySchema = z.object({
  name: z.string().readonly(),
  version: z.string().optional().readonly(),
  schemaUrl: z.string().optional().readonly()
});
const SpanDataSchema = z.object({
  spanId: z.string(),
  traceId: z.string(),
  parentSpanId: z.string().optional(),
  startTime: z.number(),
  endTime: z.number(),
  attributes: z.record(z.string(), z.any()),
  displayName: z.string(),
  links: z.array(LinkSchema).optional(),
  instrumentationLibrary: InstrumentationLibrarySchema,
  spanKind: z.string(),
  sameProcessAsParentSpan: z.object({ value: z.boolean() }).optional(),
  status: SpanStatusSchema.optional(),
  timeEvents: z.object({
    timeEvent: z.array(TimeEventSchema)
  }).optional(),
  truncated: z.boolean().optional()
});
const TraceDataSchema = z.object({
  traceId: z.string(),
  displayName: z.string().optional(),
  startTime: z.number().optional().describe("trace start time in milliseconds since the epoch"),
  endTime: z.number().optional().describe("end time in milliseconds since the epoch"),
  spans: z.record(z.string(), SpanDataSchema)
});
export {
  InstrumentationLibrarySchema,
  LinkSchema,
  PathMetadataSchema,
  SpanContextSchema,
  SpanDataSchema,
  SpanMetadataSchema,
  SpanStatusSchema,
  TimeEventSchema,
  TraceDataSchema,
  TraceMetadataSchema
};
//# sourceMappingURL=types.mjs.map