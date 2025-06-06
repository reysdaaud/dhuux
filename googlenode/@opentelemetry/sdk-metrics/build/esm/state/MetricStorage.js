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
import { createInstrumentDescriptor, } from '../InstrumentDescriptor';
/**
 * Internal interface.
 *
 * Represents a storage from which we can collect metrics.
 */
var MetricStorage = /** @class */ (function () {
    function MetricStorage(_instrumentDescriptor) {
        this._instrumentDescriptor = _instrumentDescriptor;
    }
    MetricStorage.prototype.getInstrumentDescriptor = function () {
        return this._instrumentDescriptor;
    };
    MetricStorage.prototype.updateDescription = function (description) {
        this._instrumentDescriptor = createInstrumentDescriptor(this._instrumentDescriptor.name, this._instrumentDescriptor.type, {
            description: description,
            valueType: this._instrumentDescriptor.valueType,
            unit: this._instrumentDescriptor.unit,
            advice: this._instrumentDescriptor.advice,
        });
    };
    return MetricStorage;
}());
export { MetricStorage };
//# sourceMappingURL=MetricStorage.js.map