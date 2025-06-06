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
var tracing_exports = {};
__export(tracing_exports, {
  SPAN_TYPE_ATTR: () => import_tracing.SPAN_TYPE_ATTR,
  SpanContextSchema: () => import_tracing.SpanContextSchema,
  SpanDataSchema: () => import_tracing.SpanDataSchema,
  SpanMetadataSchema: () => import_tracing.SpanMetadataSchema,
  SpanStatusSchema: () => import_tracing.SpanStatusSchema,
  TimeEventSchema: () => import_tracing.TimeEventSchema,
  TraceDataSchema: () => import_tracing.TraceDataSchema,
  TraceMetadataSchema: () => import_tracing.TraceMetadataSchema,
  TraceServerExporter: () => import_tracing.TraceServerExporter,
  appendSpan: () => import_tracing.appendSpan,
  enableTelemetry: () => import_tracing.enableTelemetry,
  flushTracing: () => import_tracing.flushTracing,
  newTrace: () => import_tracing.newTrace,
  runInNewSpan: () => import_tracing.runInNewSpan,
  setCustomMetadataAttribute: () => import_tracing.setCustomMetadataAttribute,
  setCustomMetadataAttributes: () => import_tracing.setCustomMetadataAttributes,
  setTelemetryServerUrl: () => import_tracing.setTelemetryServerUrl,
  toDisplayPath: () => import_tracing.toDisplayPath
});
module.exports = __toCommonJS(tracing_exports);
var import_tracing = require("@genkit-ai/core/tracing");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SPAN_TYPE_ATTR,
  SpanContextSchema,
  SpanDataSchema,
  SpanMetadataSchema,
  SpanStatusSchema,
  TimeEventSchema,
  TraceDataSchema,
  TraceMetadataSchema,
  TraceServerExporter,
  appendSpan,
  enableTelemetry,
  flushTracing,
  newTrace,
  runInNewSpan,
  setCustomMetadataAttribute,
  setCustomMetadataAttributes,
  setTelemetryServerUrl,
  toDisplayPath
});
//# sourceMappingURL=tracing.js.map