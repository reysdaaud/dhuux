import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import * as z from 'zod';
extendZodWithOpenApi(z);
export const PathMetadataSchema = z.object({
    path: z.string(),
    status: z.string(),
    error: z.string().optional(),
    latency: z.number(),
});
export const TraceMetadataSchema = z.object({
    featureName: z.string().optional(),
    paths: z.set(PathMetadataSchema).optional(),
    timestamp: z.number(),
});
export const SpanMetadataSchema = z.object({
    name: z.string(),
    state: z.enum(['success', 'error']).optional(),
    input: z.any().optional(),
    output: z.any().optional(),
    isRoot: z.boolean().optional(),
    metadata: z.record(z.string(), z.string()).optional(),
    path: z.string().optional(),
});
export const SpanStatusSchema = z.object({
    code: z.number(),
    message: z.string().optional(),
});
export const TimeEventSchema = z.object({
    time: z.number(),
    annotation: z.object({
        attributes: z.record(z.string(), z.unknown()),
        description: z.string(),
    }),
});
export const SpanContextSchema = z.object({
    traceId: z.string(),
    spanId: z.string(),
    isRemote: z.boolean().optional(),
    traceFlags: z.number(),
});
export const LinkSchema = z.object({
    context: SpanContextSchema.optional(),
    attributes: z.record(z.string(), z.unknown()).optional(),
    droppedAttributesCount: z.number().optional(),
});
export const InstrumentationLibrarySchema = z.object({
    name: z.string().readonly(),
    version: z.string().optional().readonly(),
    schemaUrl: z.string().optional().readonly(),
});
export const SpanDataSchema = z
    .object({
    spanId: z.string(),
    traceId: z.string(),
    parentSpanId: z.string().optional(),
    startTime: z.number(),
    endTime: z.number(),
    attributes: z.record(z.string(), z.unknown()),
    displayName: z.string(),
    links: z.array(LinkSchema).optional(),
    instrumentationLibrary: InstrumentationLibrarySchema,
    spanKind: z.string(),
    sameProcessAsParentSpan: z.object({ value: z.boolean() }).optional(),
    status: SpanStatusSchema.optional(),
    timeEvents: z
        .object({
        timeEvent: z.array(TimeEventSchema).optional(),
    })
        .optional(),
    truncated: z.boolean().optional(),
})
    .openapi('SpanData');
export const TraceDataSchema = z
    .object({
    traceId: z.string(),
    displayName: z.string().optional(),
    startTime: z
        .number()
        .optional()
        .describe('trace start time in milliseconds since the epoch'),
    endTime: z
        .number()
        .optional()
        .describe('end time in milliseconds since the epoch'),
    spans: z.record(z.string(), SpanDataSchema),
})
    .openapi('TraceData');
export const NestedSpanDataSchema = SpanDataSchema.extend({
    spans: z.lazy(() => z.array(SpanDataSchema)),
});
//# sourceMappingURL=trace.js.map