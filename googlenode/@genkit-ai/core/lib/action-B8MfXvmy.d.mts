import { JSONSchema7 } from 'json-schema';
import * as z from 'zod';
import { z as z$1 } from 'zod';
import { StatusName } from './statusTypes.mjs';
import { Dotprompt } from 'dotprompt';
import { JSONSchemaType, ErrorObject } from 'ajv';

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

interface Provider<T> {
    id: string;
    value: T;
}
interface PluginProvider {
    name: string;
    initializer: () => InitializedPlugin | void | Promise<InitializedPlugin | void>;
}
interface InitializedPlugin {
    models?: Action<z$1.ZodTypeAny, z$1.ZodTypeAny>[];
    retrievers?: Action<z$1.ZodTypeAny, z$1.ZodTypeAny>[];
    embedders?: Action<z$1.ZodTypeAny, z$1.ZodTypeAny>[];
    indexers?: Action<z$1.ZodTypeAny, z$1.ZodTypeAny>[];
    evaluators?: Action<z$1.ZodTypeAny, z$1.ZodTypeAny>[];
    /** @deprecated */
    flowStateStore?: Provider<any> | Provider<any>[];
    /** @deprecated */
    traceStore?: Provider<any> | Provider<any>[];
    /** @deprecated */
    telemetry?: any;
}
type Plugin<T extends any[]> = (...args: T) => PluginProvider;

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

interface HttpErrorWireFormat {
    details?: unknown;
    message: string;
    status: StatusName;
}
/**
 * Base error class for Genkit errors.
 */
declare class GenkitError extends Error {
    source?: string;
    status: StatusName;
    detail?: any;
    code: number;
    originalMessage: string;
    constructor({ status, message, detail, source, }: {
        status: StatusName;
        message: string;
        detail?: any;
        source?: string;
    });
    /**
     * Returns a JSON-serializable representation of this object.
     */
    toJSON(): HttpErrorWireFormat;
}
declare class UnstableApiError extends GenkitError {
    constructor(level: 'beta', message?: string);
}
/**
 * assertUnstable allows features to raise exceptions when using Genkit from *more* stable initialized instances.
 *
 * @param level The maximum stability channel allowed.
 * @param message An optional message describing which feature is not allowed.
 */
declare function assertUnstable(registry: Registry, level: 'beta', message?: string): void;
/**
 * Creates a new class of Error for issues to be returned to users.
 * Using this error allows a web framework handler (e.g. express, next) to know it
 * is safe to return the message in a request. Other kinds of errors will
 * result in a generic 500 message to avoid the possibility of internal
 * exceptions being leaked to attackers.
 * In JSON requests, code will be an HTTP code and error will be a response body.
 * In streaming requests, { code, message } will be passed as the error message.
 */
declare class UserFacingError extends GenkitError {
    constructor(status: StatusName, message: string, details?: any);
}
declare function getHttpStatus(e: any): number;
declare function getCallableJSON(e: any): HttpErrorWireFormat;
/**
 * Extracts error message from the given error object, or if input is not an error then just turn the error into a string.
 */
declare function getErrorMessage(e: any): string;
/**
 * Extracts stack trace from the given error object, or if input is not an error then returns undefined.
 */
declare function getErrorStack(e: any): string | undefined;

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
 * JSON schema.
 */
type JSONSchema = JSONSchemaType<any> | any;
/**
 * Wrapper object for various ways schema can be provided.
 */
interface ProvidedSchema {
    jsonSchema?: JSONSchema;
    schema?: z$1.ZodTypeAny;
}
/**
 * Schema validation error.
 */
declare class ValidationError extends GenkitError {
    constructor({ data, errors, schema, }: {
        data: any;
        errors: ValidationErrorDetail[];
        schema: JSONSchema;
    });
}
/**
 * Convertes a Zod schema into a JSON schema, utilizing an in-memory cache for known objects.
 * @param options Provide a json schema and/or zod schema. JSON schema has priority.
 * @returns A JSON schema.
 */
declare function toJsonSchema({ jsonSchema, schema, }: ProvidedSchema): JSONSchema | undefined;
/**
 * Schema validation error details.
 */
interface ValidationErrorDetail {
    path: string;
    message: string;
}
/**
 * Validation response.
 */
type ValidationResponse = {
    valid: true;
    errors: never;
} | {
    valid: false;
    errors: ErrorObject[];
};
/**
 * Validates the provided data against the provided schema.
 */
declare function validateSchema(data: unknown, options: ProvidedSchema): {
    valid: boolean;
    errors?: any[];
    schema: JSONSchema;
};
/**
 * Parses raw data object agaisnt the provided schema.
 */
declare function parseSchema<T = unknown>(data: unknown, options: ProvidedSchema): T;
/**
 * Registers provided schema as a named schema object in the Genkit registry.
 *
 * @hidden
 */
declare function defineSchema<T extends z$1.ZodTypeAny>(registry: Registry, name: string, schema: T): T;
/**
 * Registers provided JSON schema as a named schema object in the Genkit registry.
 *
 * @hidden
 */
declare function defineJsonSchema(registry: Registry, name: string, jsonSchema: JSONSchema): any;

type AsyncProvider<T> = () => Promise<T>;
/**
 * Type of a runnable action.
 */
type ActionType = 'custom' | 'embedder' | 'evaluator' | 'executable-prompt' | 'flow' | 'indexer' | 'model' | 'prompt' | 'reranker' | 'retriever' | 'tool' | 'util';
/**
 * A schema is either a Zod schema or a JSON schema.
 */
interface Schema {
    schema?: z.ZodTypeAny;
    jsonSchema?: JSONSchema;
}
type ActionsRecord = Record<string, Action<z.ZodTypeAny, z.ZodTypeAny>>;
/**
 * The registry is used to store and lookup actions, trace stores, flow state stores, plugins, and schemas.
 */
declare class Registry {
    parent?: Registry | undefined;
    private actionsById;
    private pluginsByName;
    private schemasByName;
    private valueByTypeAndName;
    private allPluginsInitialized;
    apiStability: 'stable' | 'beta';
    readonly asyncStore: AsyncStore;
    readonly dotprompt: Dotprompt;
    constructor(parent?: Registry | undefined);
    /**
     * Creates a new registry overlaid onto the provided registry.
     * @param parent The parent registry.
     * @returns The new overlaid registry.
     */
    static withParent(parent: Registry): Registry;
    /**
     * Looks up an action in the registry.
     * @param key The key of the action to lookup.
     * @returns The action.
     */
    lookupAction<I extends z.ZodTypeAny, O extends z.ZodTypeAny, R extends Action<I, O>>(key: string): Promise<R>;
    /**
     * Registers an action in the registry.
     * @param type The type of the action to register.
     * @param action The action to register.
     */
    registerAction<I extends z.ZodTypeAny, O extends z.ZodTypeAny>(type: ActionType, action: Action<I, O>): void;
    /**
     * Registers an action promise in the registry.
     */
    registerActionAsync<I extends z.ZodTypeAny, O extends z.ZodTypeAny>(type: ActionType, name: string, action: PromiseLike<Action<I, O>>): void;
    /**
     * Returns all actions in the registry.
     * @returns All actions in the registry.
     */
    listActions(): Promise<ActionsRecord>;
    /**
     * Initializes all plugins in the registry.
     */
    initializeAllPlugins(): Promise<void>;
    /**
     * Registers a plugin provider. This plugin must be initialized before it can be used by calling {@link initializePlugin} or {@link initializeAllPlugins}.
     * @param name The name of the plugin to register.
     * @param provider The plugin provider.
     */
    registerPluginProvider(name: string, provider: PluginProvider): void;
    /**
     * Looks up a plugin.
     * @param name The name of the plugin to lookup.
     * @returns The plugin provider.
     */
    lookupPlugin(name: string): PluginProvider | undefined;
    /**
     * Initializes a plugin already registered with {@link registerPluginProvider}.
     * @param name The name of the plugin to initialize.
     * @returns The plugin.
     */
    initializePlugin(name: string): Promise<void | InitializedPlugin>;
    /**
     * Registers a schema.
     * @param name The name of the schema to register.
     * @param data The schema to register (either a Zod schema or a JSON schema).
     */
    registerSchema(name: string, data: Schema): void;
    registerValue(type: string, name: string, value: any): void;
    lookupValue<T = unknown>(type: string, key: string): Promise<T | undefined>;
    listValues<T>(type: string): Promise<Record<string, T>>;
    /**
     * Looks up a schema.
     * @param name The name of the schema to lookup.
     * @returns The schema.
     */
    lookupSchema(name: string): Schema | undefined;
}
/**
 * Manages AsyncLocalStorage instances in a single place.
 */
declare class AsyncStore {
    private asls;
    getStore<T>(key: string): T | undefined;
    run<T, R>(key: string, store: T, callback: () => R): R;
}
/**
 * An object that has a reference to Genkit Registry.
 */
interface HasRegistry {
    get registry(): Registry;
}

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
 * Action side channel data, like auth and other invocation context infromation provided by the invoker.
 */
interface ActionContext {
    /** Information about the currently authenticated user if provided. */
    auth?: Record<string, any>;
    [additionalContext: string]: any;
}
/**
 * Execute the provided function in the runtime context. Call {@link getFlowContext()} anywhere
 * within the async call stack to retrieve the context. If context object is undefined, this function
 * is a no op passthrough, the function will be invoked as is.
 */
declare function runWithContext<R>(registry: Registry, context: ActionContext | undefined, fn: () => R): R;
/**
 * Gets the runtime context of the current flow.
 */
declare function getContext(registry: Registry | HasRegistry): ActionContext | undefined;
/**
 * A universal type that request handling extensions (e.g. express, next) can map their request to.
 * This allows ContextProviders to build consistent interfacese on any web framework.
 * Headers must be lowercase to ensure portability.
 */
interface RequestData<T = any> {
    method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS' | 'QUERY';
    headers: Record<string, string>;
    input: T;
}
/**
 * Middleware can read request data and add information to the context that will
 * be passed to the Action. If middleware throws an error, that error will fail
 * the request and the Action will not be invoked. Expected cases should return a
 * UserFacingError, which allows the request handler to know what data is safe to
 * return to end users.
 *
 * Middleware can provide validation in addition to parsing. For example, an auth
 * middleware can have policies for validating auth in addition to passing auth context
 * to the Action.
 */
type ContextProvider<C extends ActionContext = ActionContext, T = any> = (request: RequestData<T>) => C | Promise<C>;
interface ApiKeyContext extends ActionContext {
    auth: {
        apiKey: string | undefined;
    };
}
declare function apiKey(policy: (context: ApiKeyContext) => void | Promise<void>): ContextProvider<ApiKeyContext>;
declare function apiKey(value?: string): ContextProvider<ApiKeyContext>;

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
 * Action metadata.
 */
interface ActionMetadata<I extends z.ZodTypeAny, O extends z.ZodTypeAny, S extends z.ZodTypeAny> {
    actionType?: ActionType;
    name: string;
    description?: string;
    inputSchema?: I;
    inputJsonSchema?: JSONSchema7;
    outputSchema?: O;
    outputJsonSchema?: JSONSchema7;
    streamSchema?: S;
    metadata?: Record<string, any>;
}
/**
 * Results of an action run. Includes telemetry.
 */
interface ActionResult<O> {
    result: O;
    telemetry: {
        traceId: string;
        spanId: string;
    };
}
/**
 * Options (side channel) data to pass to the model.
 */
interface ActionRunOptions<S> {
    /**
     * Streaming callback (optional).
     */
    onChunk?: StreamingCallback<S>;
    /**
     * Additional runtime context data (ex. auth context data).
     */
    context?: ActionContext;
    /**
     * Additional span attributes to apply to OT spans.
     */
    telemetryLabels?: Record<string, string>;
}
/**
 * Options (side channel) data to pass to the model.
 */
interface ActionFnArg<S> {
    /**
     * Streaming callback (optional).
     */
    sendChunk: StreamingCallback<S>;
    /**
     * Additional runtime context data (ex. auth context data).
     */
    context?: ActionContext;
}
/**
 * Streaming response from an action.
 */
interface StreamingResponse<O extends z.ZodTypeAny = z.ZodTypeAny, S extends z.ZodTypeAny = z.ZodTypeAny> {
    /** Iterator over the streaming chunks. */
    stream: AsyncGenerator<z.infer<S>>;
    /** Final output of the action. */
    output: Promise<z.infer<O>>;
}
/**
 * Self-describing, validating, observable, locally and remotely callable function.
 */
type Action<I extends z.ZodTypeAny = z.ZodTypeAny, O extends z.ZodTypeAny = z.ZodTypeAny, S extends z.ZodTypeAny = z.ZodTypeAny, RunOptions extends ActionRunOptions<S> = ActionRunOptions<S>> = ((input?: z.infer<I>, options?: RunOptions) => Promise<z.infer<O>>) & {
    __action: ActionMetadata<I, O, S>;
    __registry: Registry;
    run(input?: z.infer<I>, options?: ActionRunOptions<z.infer<S>>): Promise<ActionResult<z.infer<O>>>;
    stream(input?: z.infer<I>, opts?: ActionRunOptions<z.infer<S>>): StreamingResponse<O, S>;
};
/**
 * Action factory params.
 */
type ActionParams<I extends z.ZodTypeAny, O extends z.ZodTypeAny, S extends z.ZodTypeAny = z.ZodTypeAny> = {
    name: string | {
        pluginId: string;
        actionId: string;
    };
    description?: string;
    inputSchema?: I;
    inputJsonSchema?: JSONSchema7;
    outputSchema?: O;
    outputJsonSchema?: JSONSchema7;
    metadata?: Record<string, any>;
    use?: Middleware<z.infer<I>, z.infer<O>, z.infer<S>>[];
    streamSchema?: S;
    actionType: ActionType;
};
type ActionAsyncParams<I extends z.ZodTypeAny, O extends z.ZodTypeAny, S extends z.ZodTypeAny = z.ZodTypeAny> = ActionParams<I, O, S> & {
    fn: (input: z.infer<I>, options: ActionFnArg<z.infer<S>>) => Promise<z.infer<O>>;
};
type SimpleMiddleware<I = any, O = any> = (req: I, next: (req?: I) => Promise<O>) => Promise<O>;
type MiddlewareWithOptions<I = any, O = any, S = any> = (req: I, options: ActionRunOptions<S> | undefined, next: (req?: I, options?: ActionRunOptions<S>) => Promise<O>) => Promise<O>;
/**
 * Middleware function for actions.
 */
type Middleware<I = any, O = any, S = any> = SimpleMiddleware<I, O> | MiddlewareWithOptions<I, O, S>;
/**
 * Creates an action with provided middleware.
 */
declare function actionWithMiddleware<I extends z.ZodTypeAny, O extends z.ZodTypeAny, S extends z.ZodTypeAny = z.ZodTypeAny>(action: Action<I, O, S>, middleware: Middleware<z.infer<I>, z.infer<O>, z.infer<S>>[]): Action<I, O, S>;
/**
 * Creates an action with the provided config.
 */
declare function action<I extends z.ZodTypeAny, O extends z.ZodTypeAny, S extends z.ZodTypeAny = z.ZodTypeAny>(registry: Registry, config: ActionParams<I, O, S>, fn: (input: z.infer<I>, options: ActionFnArg<z.infer<S>>) => Promise<z.infer<O>>): Action<I, O, z.infer<S>>;
/**
 * Defines an action with the given config and registers it in the registry.
 */
declare function defineAction<I extends z.ZodTypeAny, O extends z.ZodTypeAny, S extends z.ZodTypeAny = z.ZodTypeAny>(registry: Registry, config: ActionParams<I, O, S>, fn: (input: z.infer<I>, options: ActionFnArg<z.infer<S>>) => Promise<z.infer<O>>): Action<I, O, S>;
/**
 * Defines an action with the given config promise and registers it in the registry.
 */
declare function defineActionAsync<I extends z.ZodTypeAny, O extends z.ZodTypeAny, S extends z.ZodTypeAny = z.ZodTypeAny>(registry: Registry, actionType: ActionType, name: string | {
    pluginId: string;
    actionId: string;
}, config: PromiseLike<ActionAsyncParams<I, O, S>>, onInit?: (action: Action<I, O, S>) => void): PromiseLike<Action<I, O, S>>;
type StreamingCallback<T> = (chunk: T) => void;
declare const sentinelNoopStreamingCallback: () => null;
/**
 * Executes provided function with streaming callback in async local storage which can be retrieved
 * using {@link getStreamingCallback}.
 */
declare function runWithStreamingCallback<S, O>(registry: Registry, streamingCallback: StreamingCallback<S> | undefined, fn: () => O): O;
/**
 * Retrieves the {@link StreamingCallback} previously set by {@link runWithStreamingCallback}
 *
 * @hidden
 */
declare function getStreamingCallback<S>(registry: Registry): StreamingCallback<S> | undefined;
/**
 * Checks whether the caller is currently in the runtime context of an action.
 */
declare function isInRuntimeContext(registry: Registry): boolean;
/**
 * Execute the provided function in the action runtime context.
 */
declare function runInActionRuntimeContext<R>(registry: Registry, fn: () => R): R;
/**
 * Execute the provided function outside the action runtime context.
 */
declare function runOutsideActionRuntimeContext<R>(registry: Registry, fn: () => R): R;

export { parseSchema as $, type ActionContext as A, getStreamingCallback as B, type ContextProvider as C, isInRuntimeContext as D, runInActionRuntimeContext as E, runOutsideActionRuntimeContext as F, GenkitError as G, type PluginProvider as H, type InitializedPlugin as I, type JSONSchema as J, type Plugin as K, Registry as L, type MiddlewareWithOptions as M, type HasRegistry as N, type HttpErrorWireFormat as O, type Provider as P, getErrorMessage as Q, type RequestData as R, type StreamingResponse as S, getErrorStack as T, UnstableApiError as U, type ProvidedSchema as V, ValidationError as W, toJsonSchema as X, type ValidationErrorDetail as Y, type ValidationResponse as Z, validateSchema as _, apiKey as a, type AsyncProvider as a0, type ActionType as a1, type Schema as a2, AsyncStore as a3, type ApiKeyContext as b, UserFacingError as c, assertUnstable as d, getCallableJSON as e, getHttpStatus as f, getContext as g, defineJsonSchema as h, defineSchema as i, type ActionMetadata as j, type ActionResult as k, type ActionRunOptions as l, type ActionFnArg as m, type Action as n, type ActionParams as o, type ActionAsyncParams as p, type SimpleMiddleware as q, runWithContext as r, type Middleware as s, actionWithMiddleware as t, action as u, defineAction as v, defineActionAsync as w, type StreamingCallback as x, sentinelNoopStreamingCallback as y, runWithStreamingCallback as z };
