/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { OTLPExporterBase } from '../../OTLPExporterBase';
import { parseHeaders } from '../../util';
import { sendWithBeacon, sendWithXhr } from './util';
import { diag } from '@opentelemetry/api';
import { getEnv, baggageUtils } from '@opentelemetry/core';
/**
 * Collector Metric Exporter abstract base class
 */
export class OTLPExporterBrowserBase extends OTLPExporterBase {
    /**
     * @param config
     * @param serializer
     * @param contentType
     */
    constructor(config = {}, serializer, contentType) {
        super(config);
        this._useXHR = false;
        this._serializer = serializer;
        this._contentType = contentType;
        this._useXHR =
            !!config.headers || typeof navigator.sendBeacon !== 'function';
        if (this._useXHR) {
            this._headers = Object.assign({}, parseHeaders(config.headers), baggageUtils.parseKeyPairsIntoRecord(getEnv().OTEL_EXPORTER_OTLP_HEADERS));
        }
        else {
            this._headers = {};
        }
    }
    onInit() { }
    onShutdown() { }
    send(items, onSuccess, onError) {
        var _a;
        if (this._shutdownOnce.isCalled) {
            diag.debug('Shutdown already started. Cannot send objects');
            return;
        }
        const body = (_a = this._serializer.serializeRequest(items)) !== null && _a !== void 0 ? _a : new Uint8Array();
        const promise = new Promise((resolve, reject) => {
            if (this._useXHR) {
                sendWithXhr(body, this.url, Object.assign(Object.assign({}, this._headers), { 'Content-Type': this._contentType }), this.timeoutMillis, resolve, reject);
            }
            else {
                sendWithBeacon(body, this.url, { type: this._contentType }, resolve, reject);
            }
        }).then(onSuccess, onError);
        this._sendingPromises.push(promise);
        const popPromise = () => {
            const index = this._sendingPromises.indexOf(promise);
            this._sendingPromises.splice(index, 1);
        };
        promise.then(popPromise, popPromise);
    }
}
//# sourceMappingURL=OTLPExporterBrowserBase.js.map