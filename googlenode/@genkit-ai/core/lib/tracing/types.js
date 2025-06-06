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
var types_exports = {};
__export(types_exports, {
  InstrumentationLibrarySchema: () => InstrumentationLibrarySchema,
  LinkSchema: () => LinkSchema,
  PathMetadataSchema: () => PathMetadataSchema,
  SpanContextSchema: () => SpanContextSchema,
  SpanDataSchema: () => SpanDataSchema,
  SpanMetadataSchema: () => SpanMetadataSchema,
  SpanStatusSchema: () => SpanStatusSchema,
  TimeEventSchema: () => TimeEventSchema,
  TraceDataSchema: () => TraceDataSchema,
  TraceMetadataSchema: () => TraceMetadataSchema
});
module.exports = __toCommonJS(types_exports);
var import_zod = require("zod");
const PathMetadataSchema = import_zod.z.object({
  path: import_zod.z.string(),
  status: import_zod.z.string(),
  error: import_zod.z.string().optional(),
  latency: import_zod.z.number()
});
const TraceMetadataSchema = import_zod.z.object({
  featureName: import_zod.z.string().optional(),
  paths: import_zod.z.set(PathMetadataSchema).optional(),
  timestamp: import_zod.z.number()
});
const SpanMetadataSchema = import_zod.z.object({
  name: import_zod.z.string(),
  state: import_zod.z.enum(["success", "error"]).optional(),
  input: import_zod.z.any().optional(),
  output: import_zod.z.any().optional(),
  isRoot: import_zod.z.boolean().optional(),
  metadata: import_zod.z.record(import_zod.z.string(), import_zod.z.string()).optional(),
  path: import_zod.z.string().optional()
});
const SpanStatusSchema = import_zod.z.object({
  code: import_zod.z.number(),
  message: import_zod.z.string().optional()
});
const TimeEventSchema = import_zod.z.object({
  time: import_zod.z.number(),
  annotation: import_zod.z.object({
    attributes: import_zod.z.record(import_zod.z.string(), import_zod.z.any()),
    description: import_zod.z.string()
  })
});
const SpanContextSchema = import_zod.z.object({
  traceId: import_zod.z.string(),
  spanId: import_zod.z.string(),
  isRemote: import_zod.z.boolean().optional(),
  traceFlags: import_zod.z.number()
});
const LinkSchema = import_zod.z.object({
  context: SpanContextSchema.optional(),
  attributes: import_zod.z.record(import_zod.z.string(), import_zod.z.any()).optional(),
  droppedAttributesCount: import_zod.z.number().optional()
});
const InstrumentationLibrarySchema = import_zod.z.object({
  name: import_zod.z.string().readonly(),
  version: import_zod.z.string().optional().readonly(),
  schemaUrl: import_zod.z.string().optional().readonly()
});
const SpanDataSchema = import_zod.z.object({
  spanId: import_zod.z.string(),
  traceId: import_zod.z.string(),
  parentSpanId: import_zod.z.string().optional(),
  startTime: import_zod.z.number(),
  endTime: import_zod.z.number(),
  attributes: import_zod.z.record(import_zod.z.string(), import_zod.z.any()),
  displayName: import_zod.z.string(),
  links: import_zod.z.array(LinkSchema).optional(),
  instrumentationLibrary: InstrumentationLibrarySchema,
  spanKind: import_zod.z.string(),
  sameProcessAsParentSpan: import_zod.z.object({ value: import_zod.z.boolean() }).optional(),
  status: SpanStatusSchema.optional(),
  timeEvents: import_zod.z.object({
    timeEvent: import_zod.z.array(TimeEventSchema)
  }).optional(),
  truncated: import_zod.z.boolean().optional()
});
const TraceDataSchema = import_zod.z.object({
  traceId: import_zod.z.string(),
  displayName: import_zod.z.string().optional(),
  startTime: import_zod.z.number().optional().describe("trace start time in milliseconds since the epoch"),
  endTime: import_zod.z.number().optional().describe("end time in milliseconds since the epoch"),
  spans: import_zod.z.record(import_zod.z.string(), SpanDataSchema)
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=types.js.map