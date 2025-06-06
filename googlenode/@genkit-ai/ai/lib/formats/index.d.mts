import { JSONSchema } from '@genkit-ai/core';
import { Registry } from '@genkit-ai/core/registry';
import { O as OutputOptions } from '../generate-B_S-c4lq.mjs';
import { F as Formatter, k as MessageData } from '../chunk-CWo2jxKh.mjs';
import '../document-bWESTgsa.mjs';
import '../generate/response.mjs';

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

declare function defineFormat(registry: Registry, options: {
    name: string;
} & Formatter['config'], handler: Formatter['handler']): {
    config: Formatter['config'];
    handler: Formatter['handler'];
};
type FormatArgument = keyof typeof DEFAULT_FORMATS | Omit<string, keyof typeof DEFAULT_FORMATS> | undefined | null;
declare function resolveFormat(registry: Registry, outputOpts: OutputOptions | undefined): Promise<Formatter<any, any> | undefined>;
declare function resolveInstructions(format?: Formatter, schema?: JSONSchema, instructionsOption?: boolean | string): string | undefined;
declare function injectInstructions(messages: MessageData[], instructions: string | false | undefined): MessageData[];
declare const DEFAULT_FORMATS: Formatter<any, any>[];
/**
 * configureFormats registers the default built-in formats on a registry.
 */
declare function configureFormats(registry: Registry): void;

export { DEFAULT_FORMATS, type FormatArgument, Formatter, configureFormats, defineFormat, injectInstructions, resolveFormat, resolveInstructions };
