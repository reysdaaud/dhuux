import { z } from 'zod';
import { n as Action, x as StreamingCallback, A as ActionContext, L as Registry } from './action-LFZrJfrc.js';
import 'json-schema';
import './statusTypes.js';
import 'dotprompt';
import 'ajv';

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
 * Flow is an observable, streamable, (optionally) strongly typed function.
 */
interface Flow<I extends z.ZodTypeAny = z.ZodTypeAny, O extends z.ZodTypeAny = z.ZodTypeAny, S extends z.ZodTypeAny = z.ZodTypeAny> extends Action<I, O, S> {
}
/**
 * Configuration for a streaming flow.
 */
interface FlowConfig<I extends z.ZodTypeAny = z.ZodTypeAny, O extends z.ZodTypeAny = z.ZodTypeAny, S extends z.ZodTypeAny = z.ZodTypeAny> {
    /** Name of the flow. */
    name: string;
    /** Schema of the input to the flow. */
    inputSchema?: I;
    /** Schema of the output from the flow. */
    outputSchema?: O;
    /** Schema of the streaming chunks from the flow. */
    streamSchema?: S;
}
/**
 * Flow execution context for flow to access the streaming callback and
 * side-channel context data. The context itself is a function, a short-cut
 * for streaming callback.
 */
interface FlowSideChannel<S> {
    (chunk: S): void;
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
 * Function to be executed in the flow.
 */
type FlowFn<I extends z.ZodTypeAny = z.ZodTypeAny, O extends z.ZodTypeAny = z.ZodTypeAny, S extends z.ZodTypeAny = z.ZodTypeAny> = (
/** Input to the flow. */
input: z.infer<I>, 
/** Callback for streaming functions only. */
streamingCallback: FlowSideChannel<z.infer<S>>) => Promise<z.infer<O>> | z.infer<O>;
/**
 * Defines a non-streaming flow. This operates on the currently active registry.
 */
declare function defineFlow<I extends z.ZodTypeAny = z.ZodTypeAny, O extends z.ZodTypeAny = z.ZodTypeAny, S extends z.ZodTypeAny = z.ZodTypeAny>(registry: Registry, config: FlowConfig<I, O, S> | string, fn: FlowFn<I, O, S>): Flow<I, O, S>;
declare function run<T>(name: string, func: () => Promise<T>, registry?: Registry): Promise<T>;
declare function run<T>(name: string, input: any, func: (input?: any) => Promise<T>, registry?: Registry): Promise<T>;

export { type Flow, type FlowConfig, type FlowFn, type FlowSideChannel, defineFlow, run };
