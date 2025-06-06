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
 * Deletes any properties with `undefined` values in the provided object.
 * Modifies the provided object.
 */
declare function deleteUndefinedProps(obj: any): void;
/**
 * Strips (non distructively) any properties with `undefined` values in the provided object and returns
 */
declare function stripUndefinedProps<T>(input: T): T;
/**
 * Returns the current environment that the app code is running in.
 *
 * @hidden
 */
declare function getCurrentEnv(): string;
/**
 * Whether the current environment is `dev`.
 */
declare function isDevEnv(): boolean;
/**
 * Adds flow-specific prefix for OpenTelemetry span attributes.
 */
declare function featureMetadataPrefix(name: string): string;

export { deleteUndefinedProps, featureMetadataPrefix, getCurrentEnv, isDevEnv, stripUndefinedProps };
