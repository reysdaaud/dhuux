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
import * as process from 'process';
var getMachineId;
switch (process.platform) {
    case 'darwin':
        (getMachineId = require('./getMachineId-darwin').getMachineId);
        break;
    case 'linux':
        (getMachineId = require('./getMachineId-linux').getMachineId);
        break;
    case 'freebsd':
        (getMachineId = require('./getMachineId-bsd').getMachineId);
        break;
    case 'win32':
        (getMachineId = require('./getMachineId-win').getMachineId);
        break;
    default:
        (getMachineId = require('./getMachineId-unsupported').getMachineId);
}
export { getMachineId };
//# sourceMappingURL=getMachineId.js.map