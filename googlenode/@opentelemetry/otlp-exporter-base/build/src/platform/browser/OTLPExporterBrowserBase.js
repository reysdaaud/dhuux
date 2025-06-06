"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTLPExporterBrowserBase = void 0;
const OTLPExporterBase_1 = require("../../OTLPExporterBase");
const util_1 = require("../../util");
const util_2 = require("./util");
const api_1 = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
/**
 * Collector Metric Exporter abstract base class
 */
class OTLPExporterBrowserBase extends OTLPExporterBase_1.OTLPExporterBase {
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
            this._headers = Object.assign({}, (0, util_1.parseHeaders)(config.headers), core_1.baggageUtils.parseKeyPairsIntoRecord((0, core_1.getEnv)().OTEL_EXPORTER_OTLP_HEADERS));
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
            api_1.diag.debug('Shutdown already started. Cannot send objects');
            return;
        }
        const body = (_a = this._serializer.serializeRequest(items)) !== null && _a !== void 0 ? _a : new Uint8Array();
        const promise = new Promise((resolve, reject) => {
            if (this._useXHR) {
                (0, util_2.sendWithXhr)(body, this.url, Object.assign(Object.assign({}, this._headers), { 'Content-Type': this._contentType }), this.timeoutMillis, resolve, reject);
            }
            else {
                (0, util_2.sendWithBeacon)(body, this.url, { type: this._contentType }, resolve, reject);
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
exports.OTLPExporterBrowserBase = OTLPExporterBrowserBase;
//# sourceMappingURL=OTLPExporterBrowserBase.js.map