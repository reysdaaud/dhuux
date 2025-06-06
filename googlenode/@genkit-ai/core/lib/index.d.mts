export { z } from 'zod';
export { n as Action, p as ActionAsyncParams, A as ActionContext, m as ActionFnArg, j as ActionMetadata, o as ActionParams, k as ActionResult, l as ActionRunOptions, b as ApiKeyContext, C as ContextProvider, G as GenkitError, I as InitializedPlugin, J as JSONSchema, s as Middleware, M as MiddlewareWithOptions, K as Plugin, H as PluginProvider, P as Provider, R as RequestData, q as SimpleMiddleware, x as StreamingCallback, S as StreamingResponse, U as UnstableApiError, c as UserFacingError, u as action, t as actionWithMiddleware, a as apiKey, d as assertUnstable, v as defineAction, w as defineActionAsync, h as defineJsonSchema, i as defineSchema, e as getCallableJSON, g as getContext, f as getHttpStatus, B as getStreamingCallback, D as isInRuntimeContext, E as runInActionRuntimeContext, F as runOutsideActionRuntimeContext, r as runWithContext, z as runWithStreamingCallback, y as sentinelNoopStreamingCallback } from './action-B8MfXvmy.mjs';
export { Flow, FlowConfig, FlowFn, FlowSideChannel, defineFlow, run } from './flow.mjs';
export { ReflectionServer, ReflectionServerOptions, RunActionResponse, RunActionResponseSchema } from './reflection.mjs';
export { TelemetryConfig } from './telemetryTypes.mjs';
export { deleteUndefinedProps, featureMetadataPrefix, getCurrentEnv, isDevEnv, stripUndefinedProps } from './utils.mjs';
export { Status, StatusCodes, StatusName, StatusSchema } from './statusTypes.mjs';
export { JSONSchema7 } from 'json-schema';
import 'dotprompt';
import 'ajv';
import '@opentelemetry/sdk-node';

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
 * Genkit library version.
 */
declare const GENKIT_VERSION = "1.6.2";
/**
 * Genkit client header for API calls.
 */
declare const GENKIT_CLIENT_HEADER: string;
declare const GENKIT_REFLECTION_API_SPEC_VERSION = 1;

export { GENKIT_CLIENT_HEADER, GENKIT_REFLECTION_API_SPEC_VERSION, GENKIT_VERSION };
