import { ExportResult } from '@opentelemetry/core';
import { SpanExporter, ReadableSpan } from '@opentelemetry/sdk-trace-base';

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

declare let telemetryServerUrl: string | undefined;
/**
 * @hidden
 */
declare function setTelemetryServerUrl(url: string): void;
/**
 * Exports collected OpenTelemetetry spans to the telemetry server.
 */
declare class TraceServerExporter implements SpanExporter {
    /**
     * Export spans.
     * @param spans
     * @param resultCallback
     */
    export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void;
    /**
     * Shutdown the exporter.
     */
    shutdown(): Promise<void>;
    /**
     * Converts span info into trace store format.
     * @param span
     */
    private _exportInfo;
    /**
     * Exports any pending spans in exporter
     */
    forceFlush(): Promise<void>;
    private _sendSpans;
    private save;
}

export { TraceServerExporter, setTelemetryServerUrl, telemetryServerUrl };
