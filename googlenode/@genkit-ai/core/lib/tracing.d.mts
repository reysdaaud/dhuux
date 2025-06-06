import { TelemetryConfig } from './telemetryTypes.mjs';
export { TraceServerExporter, setTelemetryServerUrl, telemetryServerUrl } from './tracing/exporter.mjs';
export { ATTR_PREFIX, SPAN_TYPE_ATTR, appendSpan, newTrace, runInNewSpan, setCustomMetadataAttribute, setCustomMetadataAttributes, spanMetadataAlsKey, toDisplayPath, traceMetadataAlsKey } from './tracing/instrumentation.mjs';
export { GenkitSpanProcessorWrapper } from './tracing/processor.mjs';
export { InstrumentationLibrarySchema, LinkSchema, PathMetadata, PathMetadataSchema, SpanContextSchema, SpanData, SpanDataSchema, SpanMetadata, SpanMetadataSchema, SpanStatusSchema, TimeEventSchema, TraceData, TraceDataSchema, TraceMetadata, TraceMetadataSchema } from './tracing/types.mjs';
import '@opentelemetry/sdk-node';
import '@opentelemetry/core';
import '@opentelemetry/sdk-trace-base';
import '@opentelemetry/api';
import './action-B8MfXvmy.mjs';
import 'json-schema';
import 'zod';
import './statusTypes.mjs';
import 'dotprompt';
import 'ajv';

/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @hidden
 */
declare function ensureBasicTelemetryInstrumentation(): Promise<any>;
/**
 * Enables tracing and metrics open telemetry configuration.
 */
declare function enableTelemetry(telemetryConfig: TelemetryConfig | Promise<TelemetryConfig>): Promise<void>;
declare function cleanUpTracing(): Promise<void>;
/**
 * Flushes all configured span processors.
 *
 * @hidden
 */
declare function flushTracing(): Promise<void>;

export { cleanUpTracing, enableTelemetry, ensureBasicTelemetryInstrumentation, flushTracing };
