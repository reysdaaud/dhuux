import { Link, Span } from '@opentelemetry/api';
import { L as Registry, N as HasRegistry } from '../action-LFZrJfrc.js';
import { SpanMetadata } from './types.js';
import 'json-schema';
import 'zod';
import '../statusTypes.js';
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

declare const spanMetadataAlsKey = "core.tracing.instrumentation.span";
declare const traceMetadataAlsKey = "core.tracing.instrumentation.trace";
declare const ATTR_PREFIX = "genkit";
/** @hidden */
declare const SPAN_TYPE_ATTR: string;
/**
 * @hidden
 */
declare function newTrace<T>(registry: Registry | HasRegistry, opts: {
    name: string;
    labels?: Record<string, string>;
    links?: Link[];
}, fn: (metadata: SpanMetadata, rootSpan: Span) => Promise<T>): Promise<T>;
/**
 * Runs the provided function in a new span.
 *
 * @hidden
 */
declare function runInNewSpan<T>(registry: Registry | HasRegistry, opts: {
    metadata: SpanMetadata;
    labels?: Record<string, string>;
    links?: Link[];
}, fn: (metadata: SpanMetadata, otSpan: Span, isRoot: boolean) => Promise<T>): Promise<T>;
/**
 * Creates a new child span and attaches it to a previously created trace. This
 * is useful, for example, for adding deferred user engagement metadata.
 *
 * @hidden
 */
declare function appendSpan(traceId: string, parentSpanId: string, metadata: SpanMetadata, labels?: Record<string, string>): Promise<void>;
/**
 * Sets provided attribute value in the current span.
 *
 * @hidden
 */
declare function setCustomMetadataAttribute(registry: Registry, key: string, value: string): void;
/**
 * Sets provided attribute values in the current span.
 *
 * @hidden
 */
declare function setCustomMetadataAttributes(registry: Registry, values: Record<string, string>): void;
/**
 * Converts a fully annotated path to a friendly display version for logs
 *
 * @hidden
 */
declare function toDisplayPath(path: string): string;

export { ATTR_PREFIX, SPAN_TYPE_ATTR, appendSpan, newTrace, runInNewSpan, setCustomMetadataAttribute, setCustomMetadataAttributes, spanMetadataAlsKey, toDisplayPath, traceMetadataAlsKey };
