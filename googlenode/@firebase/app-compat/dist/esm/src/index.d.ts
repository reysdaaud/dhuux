/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { FirebaseNamespace } from './public-types';
declare global {
    interface Window {
        firebase: FirebaseNamespace;
    }
}
declare const firebase: FirebaseNamespace;
export default firebase;
export { _FirebaseNamespace, _FirebaseService } from './types';
export { FirebaseApp, FirebaseNamespace } from './public-types';
