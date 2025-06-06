import { JSONSchema, Action, z, SimpleMiddleware, StreamingCallback } from '@genkit-ai/core';
import { Registry } from '@genkit-ai/core/registry';
import { M as MediaPart, D as Document, l as ToolResponsePart, k as ToolRequestPart } from './document-bWESTgsa.js';

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
 * Preprocess a GenerateRequest to download referenced http(s) media URLs and
 * inline them as data URIs.
 */
declare function downloadRequestMedia(options?: {
    maxBytes?: number;
    filter?: (part: MediaPart) => boolean;
}): ModelMiddleware;
/**
 * Validates that a GenerateRequest does not include unsupported features.
 */
declare function validateSupport(options: {
    name: string;
    supports?: ModelInfo['supports'];
}): ModelMiddleware;
/**
 * Provide a simulated system prompt for models that don't support it natively.
 */
declare function simulateSystemPrompt(options?: {
    preface: string;
    acknowledgement: string;
}): ModelMiddleware;
interface AugmentWithContextOptions {
    /** Preceding text to place before the rendered context documents. */
    preface?: string | null;
    /** A function to render a document into a text part to be included in the message. */
    itemTemplate?: (d: Document, options?: AugmentWithContextOptions) => string;
    /** The metadata key to use for citation reference. Pass `null` to provide no citations. */
    citationKey?: string | null;
}
declare const CONTEXT_PREFACE = "\n\nUse the following information to complete your task:\n\n";
declare function augmentWithContext(options?: AugmentWithContextOptions): ModelMiddleware;
interface SimulatedConstrainedGenerationOptions {
    instructionsRenderer?: (schema: Record<string, any>) => string;
}
/**
 * Model middleware that simulates constrained generation by injecting generation
 * instructions into the user message.
 */
declare function simulateConstrainedGeneration(options?: SimulatedConstrainedGenerationOptions): ModelMiddleware;

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

interface MessageParser<T = unknown> {
    (message: Message): T;
}
/**
 * Message represents a single role's contribution to a generation. Each message
 * can contain multiple parts (for example text and an image), and each generation
 * can contain multiple messages.
 */
declare class Message<T = unknown> implements MessageData {
    role: MessageData['role'];
    content: Part[];
    metadata?: Record<string, any>;
    parser?: MessageParser<T>;
    static parseData(lenientMessage: string | (MessageData & {
        content: string | Part | Part[];
        role: string;
    }) | MessageData, defaultRole?: MessageData['role']): MessageData;
    static parse(lenientMessage: string | (MessageData & {
        content: string;
    }) | MessageData): Message;
    static parseContent(lenientPart: string | Part | (string | Part)[]): Part[];
    constructor(message: MessageData, options?: {
        parser?: MessageParser<T>;
    });
    /**
     * Attempts to parse the content of the message according to the supplied
     * output parser. Without a parser, returns `data` contained in the message or
     * tries to parse JSON from the text of the message.
     *
     * @returns The structured output contained in the message.
     */
    get output(): T;
    toolResponseParts(): ToolResponsePart[];
    /**
     * Concatenates all `text` parts present in the message with no delimiter.
     * @returns A string of all concatenated text parts.
     */
    get text(): string;
    /**
     * Returns the first media part detected in the message. Useful for extracting
     * (for example) an image from a generation expected to create one.
     * @returns The first detected `media` part in the message.
     */
    get media(): {
        url: string;
        contentType?: string;
    } | null;
    /**
     * Returns the first detected `data` part of a message.
     * @returns The first `data` part detected in the message (if any).
     */
    get data(): T | null;
    /**
     * Returns all tool request found in this message.
     * @returns Array of all tool request found in this message.
     */
    get toolRequests(): ToolRequestPart[];
    /**
     * Returns all tool requests annotated with interrupt metadata.
     * @returns Array of all interrupt tool requests.
     */
    get interrupts(): ToolRequestPart[];
    /**
     * Converts the Message to a plain JS object.
     * @returns Plain JS object representing the data contained in the message.
     */
    toJSON(): MessageData;
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

type OutputContentTypes = 'application/json' | 'text/plain';
interface Formatter<O = unknown, CO = unknown> {
    name: string;
    config: ModelRequest['output'] & {
        defaultInstructions?: false;
    };
    handler: (schema?: JSONSchema) => {
        parseMessage(message: Message): O;
        parseChunk?: (chunk: GenerateResponseChunk) => CO;
        instructions?: string;
    };
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

type GenerateAction = Action<typeof GenerateActionOptionsSchema, typeof GenerateResponseSchema, typeof GenerateResponseChunkSchema>;
/** Defines (registers) a utilty generate action. */
declare function defineGenerateAction(registry: Registry): GenerateAction;
/**
 * Encapsulates all generate logic. This is similar to `generateAction` except not an action and can take middleware.
 */
declare function generateHelper(registry: Registry, options: {
    rawRequest: GenerateActionOptions;
    middleware?: ModelMiddleware[];
    currentTurn?: number;
    messageIndex?: number;
}): Promise<GenerateResponseData>;
declare function shouldInjectFormatInstructions(formatConfig?: Formatter['config'], rawRequestConfig?: z.infer<typeof GenerateActionOutputConfig>): string | boolean | undefined;
declare function inferRoleFromParts(parts: Part[]): Role;

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
 * Zod schema of message part.
 */
declare const PartSchema: z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
    text: z.ZodOptional<z.ZodNever>;
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, {
    text: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    text: string;
    custom?: Record<string, unknown> | undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    metadata?: Record<string, unknown> | undefined;
}, {
    text: string;
    custom?: Record<string, unknown> | undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    metadata?: Record<string, unknown> | undefined;
}>, z.ZodObject<z.objectUtil.extendShape<{
    text: z.ZodOptional<z.ZodNever>;
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, {
    media: z.ZodObject<{
        contentType: z.ZodOptional<z.ZodString>;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        contentType?: string | undefined;
    }, {
        url: string;
        contentType?: string | undefined;
    }>;
}>, "strip", z.ZodTypeAny, {
    media: {
        url: string;
        contentType?: string | undefined;
    };
    custom?: Record<string, unknown> | undefined;
    text?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    metadata?: Record<string, unknown> | undefined;
}, {
    media: {
        url: string;
        contentType?: string | undefined;
    };
    custom?: Record<string, unknown> | undefined;
    text?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    metadata?: Record<string, unknown> | undefined;
}>, z.ZodObject<z.objectUtil.extendShape<{
    text: z.ZodOptional<z.ZodNever>;
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, {
    toolRequest: z.ZodObject<{
        ref: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        input: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        ref?: string | undefined;
        input?: unknown;
    }, {
        name: string;
        ref?: string | undefined;
        input?: unknown;
    }>;
}>, "strip", z.ZodTypeAny, {
    toolRequest: {
        name: string;
        ref?: string | undefined;
        input?: unknown;
    };
    custom?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    metadata?: Record<string, unknown> | undefined;
}, {
    toolRequest: {
        name: string;
        ref?: string | undefined;
        input?: unknown;
    };
    custom?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    metadata?: Record<string, unknown> | undefined;
}>, z.ZodObject<z.objectUtil.extendShape<{
    text: z.ZodOptional<z.ZodNever>;
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, {
    toolResponse: z.ZodObject<{
        ref: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        output: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        output?: unknown;
        ref?: string | undefined;
    }, {
        name: string;
        output?: unknown;
        ref?: string | undefined;
    }>;
}>, "strip", z.ZodTypeAny, {
    toolResponse: {
        name: string;
        output?: unknown;
        ref?: string | undefined;
    };
    custom?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolRequest?: undefined;
    data?: unknown;
    metadata?: Record<string, unknown> | undefined;
}, {
    toolResponse: {
        name: string;
        output?: unknown;
        ref?: string | undefined;
    };
    custom?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolRequest?: undefined;
    data?: unknown;
    metadata?: Record<string, unknown> | undefined;
}>, z.ZodObject<z.objectUtil.extendShape<{
    text: z.ZodOptional<z.ZodNever>;
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, {
    data: z.ZodUnknown;
}>, "strip", z.ZodTypeAny, {
    custom?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    metadata?: Record<string, unknown> | undefined;
}, {
    custom?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    metadata?: Record<string, unknown> | undefined;
}>, z.ZodObject<z.objectUtil.extendShape<{
    text: z.ZodOptional<z.ZodNever>;
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, {
    custom: z.ZodRecord<z.ZodString, z.ZodAny>;
}>, "strip", z.ZodTypeAny, {
    custom: Record<string, any>;
    text?: undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    metadata?: Record<string, unknown> | undefined;
}, {
    custom: Record<string, any>;
    text?: undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    metadata?: Record<string, unknown> | undefined;
}>]>;
/**
 * Message part.
 */
type Part = z.infer<typeof PartSchema>;
/**
 * Zod schema of a message role.
 */
declare const RoleSchema: z.ZodEnum<["system", "user", "model", "tool"]>;
/**
 * Message role.
 */
type Role = z.infer<typeof RoleSchema>;
/**
 * Zod schema of a message.
 */
declare const MessageSchema: z.ZodObject<{
    role: z.ZodEnum<["system", "user", "model", "tool"]>;
    content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        text: z.ZodString;
    }>, "strip", z.ZodTypeAny, {
        text: string;
        custom?: Record<string, unknown> | undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        text: string;
        custom?: Record<string, unknown> | undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>, z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        media: z.ZodObject<{
            contentType: z.ZodOptional<z.ZodString>;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            url: string;
            contentType?: string | undefined;
        }, {
            url: string;
            contentType?: string | undefined;
        }>;
    }>, "strip", z.ZodTypeAny, {
        media: {
            url: string;
            contentType?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        media: {
            url: string;
            contentType?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>, z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        toolRequest: z.ZodObject<{
            ref: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            input: z.ZodOptional<z.ZodUnknown>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        }, {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        }>;
    }>, "strip", z.ZodTypeAny, {
        toolRequest: {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        toolRequest: {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>, z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        toolResponse: z.ZodObject<{
            ref: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            output: z.ZodOptional<z.ZodUnknown>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        }, {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        }>;
    }>, "strip", z.ZodTypeAny, {
        toolResponse: {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        toolResponse: {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>, z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        data: z.ZodUnknown;
    }>, "strip", z.ZodTypeAny, {
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>, z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        custom: z.ZodRecord<z.ZodString, z.ZodAny>;
    }>, "strip", z.ZodTypeAny, {
        custom: Record<string, any>;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        custom: Record<string, any>;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>]>, "many">;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    role: "model" | "system" | "user" | "tool";
    content: ({
        text: string;
        custom?: Record<string, unknown> | undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        media: {
            url: string;
            contentType?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        toolRequest: {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        toolResponse: {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        custom: Record<string, any>;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    })[];
    metadata?: Record<string, unknown> | undefined;
}, {
    role: "model" | "system" | "user" | "tool";
    content: ({
        text: string;
        custom?: Record<string, unknown> | undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        media: {
            url: string;
            contentType?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        toolRequest: {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        toolResponse: {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        custom: Record<string, any>;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    })[];
    metadata?: Record<string, unknown> | undefined;
}>;
/**
 * Model message data.
 */
type MessageData = z.infer<typeof MessageSchema>;
/**
 * Zod schema of model info metadata.
 */
declare const ModelInfoSchema: z.ZodObject<{
    /** Acceptable names for this model (e.g. different versions). */
    versions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Friendly label for this model (e.g. "Google AI - Gemini Pro") */
    label: z.ZodOptional<z.ZodString>;
    /** Model Specific configuration. */
    configSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    /** Supported model capabilities. */
    supports: z.ZodOptional<z.ZodObject<{
        /** Model can process historical messages passed with a prompt. */
        multiturn: z.ZodOptional<z.ZodBoolean>;
        /** Model can process media as part of the prompt (multimodal input). */
        media: z.ZodOptional<z.ZodBoolean>;
        /** Model can perform tool calls. */
        tools: z.ZodOptional<z.ZodBoolean>;
        /** Model can accept messages with role "system". */
        systemRole: z.ZodOptional<z.ZodBoolean>;
        /** Model can output this type of data. */
        output: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Model supports output in these content types. */
        contentType: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Model can natively support document-based context grounding. */
        context: z.ZodOptional<z.ZodBoolean>;
        /** Model can natively support constrained generation. */
        constrained: z.ZodOptional<z.ZodEnum<["none", "all", "no-tools"]>>;
        /** Model supports controlling tool choice, e.g. forced tool calling. */
        toolChoice: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        tools?: boolean | undefined;
        toolChoice?: boolean | undefined;
        output?: string[] | undefined;
        context?: boolean | undefined;
        media?: boolean | undefined;
        contentType?: string[] | undefined;
        constrained?: "none" | "all" | "no-tools" | undefined;
        multiturn?: boolean | undefined;
        systemRole?: boolean | undefined;
    }, {
        tools?: boolean | undefined;
        toolChoice?: boolean | undefined;
        output?: string[] | undefined;
        context?: boolean | undefined;
        media?: boolean | undefined;
        contentType?: string[] | undefined;
        constrained?: "none" | "all" | "no-tools" | undefined;
        multiturn?: boolean | undefined;
        systemRole?: boolean | undefined;
    }>>;
    /** At which stage of development this model is.
     * - `featured` models are recommended for general use.
     * - `stable` models are well-tested and reliable.
     * - `unstable` models are experimental and may change.
     * - `legacy` models are no longer recommended for new projects.
     * - `deprecated` models are deprecated by the provider and may be removed in future versions.
     */
    stage: z.ZodOptional<z.ZodEnum<["featured", "stable", "unstable", "legacy", "deprecated"]>>;
}, "strip", z.ZodTypeAny, {
    versions?: string[] | undefined;
    label?: string | undefined;
    configSchema?: Record<string, any> | undefined;
    supports?: {
        tools?: boolean | undefined;
        toolChoice?: boolean | undefined;
        output?: string[] | undefined;
        context?: boolean | undefined;
        media?: boolean | undefined;
        contentType?: string[] | undefined;
        constrained?: "none" | "all" | "no-tools" | undefined;
        multiturn?: boolean | undefined;
        systemRole?: boolean | undefined;
    } | undefined;
    stage?: "featured" | "stable" | "unstable" | "legacy" | "deprecated" | undefined;
}, {
    versions?: string[] | undefined;
    label?: string | undefined;
    configSchema?: Record<string, any> | undefined;
    supports?: {
        tools?: boolean | undefined;
        toolChoice?: boolean | undefined;
        output?: string[] | undefined;
        context?: boolean | undefined;
        media?: boolean | undefined;
        contentType?: string[] | undefined;
        constrained?: "none" | "all" | "no-tools" | undefined;
        multiturn?: boolean | undefined;
        systemRole?: boolean | undefined;
    } | undefined;
    stage?: "featured" | "stable" | "unstable" | "legacy" | "deprecated" | undefined;
}>;
/**
 * Model info metadata.
 */
type ModelInfo = z.infer<typeof ModelInfoSchema>;
/**
 * Zod schema of a tool definition.
 */
declare const ToolDefinitionSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    inputSchema: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    outputSchema: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    metadata?: Record<string, any> | undefined;
    inputSchema?: Record<string, any> | null | undefined;
    outputSchema?: Record<string, any> | null | undefined;
}, {
    name: string;
    description: string;
    metadata?: Record<string, any> | undefined;
    inputSchema?: Record<string, any> | null | undefined;
    outputSchema?: Record<string, any> | null | undefined;
}>;
/**
 * Tool definition.
 */
type ToolDefinition = z.infer<typeof ToolDefinitionSchema>;
/**
 * Configuration parameter descriptions.
 */
declare const GenerationCommonConfigDescriptions: {
    temperature: string;
    maxOutputTokens: string;
    topK: string;
    topP: string;
};
/**
 * Zod schema of a common config object.
 */
declare const GenerationCommonConfigSchema: z.ZodObject<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    version?: string | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}, {
    version?: string | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}>;
/**
 * Common config object.
 */
type GenerationCommonConfig = typeof GenerationCommonConfigSchema;
/**
 * Zod schema of output config.
 */
declare const OutputConfigSchema: z.ZodObject<{
    format: z.ZodOptional<z.ZodString>;
    schema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    constrained: z.ZodOptional<z.ZodBoolean>;
    contentType: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    contentType?: string | undefined;
    format?: string | undefined;
    schema?: Record<string, any> | undefined;
    constrained?: boolean | undefined;
}, {
    contentType?: string | undefined;
    format?: string | undefined;
    schema?: Record<string, any> | undefined;
    constrained?: boolean | undefined;
}>;
/**
 * Output config.
 */
type OutputConfig = z.infer<typeof OutputConfigSchema>;
/** ModelRequestSchema represents the parameters that are passed to a model when generating content. */
declare const ModelRequestSchema: z.ZodObject<{
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["system", "user", "model", "tool"]>;
        content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            text: z.ZodString;
        }>, "strip", z.ZodTypeAny, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            media: z.ZodObject<{
                contentType: z.ZodOptional<z.ZodString>;
                url: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                url: string;
                contentType?: string | undefined;
            }, {
                url: string;
                contentType?: string | undefined;
            }>;
        }>, "strip", z.ZodTypeAny, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            toolRequest: z.ZodObject<{
                ref: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                input: z.ZodOptional<z.ZodUnknown>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            }, {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            }>;
        }>, "strip", z.ZodTypeAny, {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            toolResponse: z.ZodObject<{
                ref: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                output: z.ZodOptional<z.ZodUnknown>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            }, {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            }>;
        }>, "strip", z.ZodTypeAny, {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            data: z.ZodUnknown;
        }>, "strip", z.ZodTypeAny, {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            custom: z.ZodRecord<z.ZodString, z.ZodAny>;
        }>, "strip", z.ZodTypeAny, {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>]>, "many">;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }, {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }>, "many">;
    config: z.ZodOptional<z.ZodAny>;
    tools: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        inputSchema: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>>;
        outputSchema: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        metadata?: Record<string, any> | undefined;
        inputSchema?: Record<string, any> | null | undefined;
        outputSchema?: Record<string, any> | null | undefined;
    }, {
        name: string;
        description: string;
        metadata?: Record<string, any> | undefined;
        inputSchema?: Record<string, any> | null | undefined;
        outputSchema?: Record<string, any> | null | undefined;
    }>, "many">>;
    toolChoice: z.ZodOptional<z.ZodEnum<["auto", "required", "none"]>>;
    output: z.ZodOptional<z.ZodObject<{
        format: z.ZodOptional<z.ZodString>;
        schema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        constrained: z.ZodOptional<z.ZodBoolean>;
        contentType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        contentType?: string | undefined;
        format?: string | undefined;
        schema?: Record<string, any> | undefined;
        constrained?: boolean | undefined;
    }, {
        contentType?: string | undefined;
        format?: string | undefined;
        schema?: Record<string, any> | undefined;
        constrained?: boolean | undefined;
    }>>;
    docs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            text: z.ZodString;
        }>, "strip", z.ZodTypeAny, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            media: z.ZodObject<{
                contentType: z.ZodOptional<z.ZodString>;
                url: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                url: string;
                contentType?: string | undefined;
            }, {
                url: string;
                contentType?: string | undefined;
            }>;
        }>, "strip", z.ZodTypeAny, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>]>, "many">;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, any> | undefined;
    }, {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, any> | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    messages: {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }[];
    docs?: {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, any> | undefined;
    }[] | undefined;
    tools?: {
        name: string;
        description: string;
        metadata?: Record<string, any> | undefined;
        inputSchema?: Record<string, any> | null | undefined;
        outputSchema?: Record<string, any> | null | undefined;
    }[] | undefined;
    toolChoice?: "auto" | "required" | "none" | undefined;
    config?: any;
    output?: {
        contentType?: string | undefined;
        format?: string | undefined;
        schema?: Record<string, any> | undefined;
        constrained?: boolean | undefined;
    } | undefined;
}, {
    messages: {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }[];
    docs?: {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, any> | undefined;
    }[] | undefined;
    tools?: {
        name: string;
        description: string;
        metadata?: Record<string, any> | undefined;
        inputSchema?: Record<string, any> | null | undefined;
        outputSchema?: Record<string, any> | null | undefined;
    }[] | undefined;
    toolChoice?: "auto" | "required" | "none" | undefined;
    config?: any;
    output?: {
        contentType?: string | undefined;
        format?: string | undefined;
        schema?: Record<string, any> | undefined;
        constrained?: boolean | undefined;
    } | undefined;
}>;
/** ModelRequest represents the parameters that are passed to a model when generating content. */
interface ModelRequest<CustomOptionsSchema extends z.ZodTypeAny = z.ZodTypeAny> extends z.infer<typeof ModelRequestSchema> {
    config?: z.infer<CustomOptionsSchema>;
}
/**
 * Zod schema of a generate request.
 */
declare const GenerateRequestSchema: z.ZodObject<z.objectUtil.extendShape<{
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["system", "user", "model", "tool"]>;
        content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            text: z.ZodString;
        }>, "strip", z.ZodTypeAny, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            media: z.ZodObject<{
                contentType: z.ZodOptional<z.ZodString>;
                url: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                url: string;
                contentType?: string | undefined;
            }, {
                url: string;
                contentType?: string | undefined;
            }>;
        }>, "strip", z.ZodTypeAny, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            toolRequest: z.ZodObject<{
                ref: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                input: z.ZodOptional<z.ZodUnknown>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            }, {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            }>;
        }>, "strip", z.ZodTypeAny, {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            toolResponse: z.ZodObject<{
                ref: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                output: z.ZodOptional<z.ZodUnknown>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            }, {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            }>;
        }>, "strip", z.ZodTypeAny, {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            data: z.ZodUnknown;
        }>, "strip", z.ZodTypeAny, {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            custom: z.ZodRecord<z.ZodString, z.ZodAny>;
        }>, "strip", z.ZodTypeAny, {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>]>, "many">;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }, {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }>, "many">;
    config: z.ZodOptional<z.ZodAny>;
    tools: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        inputSchema: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>>;
        outputSchema: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        metadata?: Record<string, any> | undefined;
        inputSchema?: Record<string, any> | null | undefined;
        outputSchema?: Record<string, any> | null | undefined;
    }, {
        name: string;
        description: string;
        metadata?: Record<string, any> | undefined;
        inputSchema?: Record<string, any> | null | undefined;
        outputSchema?: Record<string, any> | null | undefined;
    }>, "many">>;
    toolChoice: z.ZodOptional<z.ZodEnum<["auto", "required", "none"]>>;
    output: z.ZodOptional<z.ZodObject<{
        format: z.ZodOptional<z.ZodString>;
        schema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        constrained: z.ZodOptional<z.ZodBoolean>;
        contentType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        contentType?: string | undefined;
        format?: string | undefined;
        schema?: Record<string, any> | undefined;
        constrained?: boolean | undefined;
    }, {
        contentType?: string | undefined;
        format?: string | undefined;
        schema?: Record<string, any> | undefined;
        constrained?: boolean | undefined;
    }>>;
    docs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            text: z.ZodString;
        }>, "strip", z.ZodTypeAny, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            media: z.ZodObject<{
                contentType: z.ZodOptional<z.ZodString>;
                url: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                url: string;
                contentType?: string | undefined;
            }, {
                url: string;
                contentType?: string | undefined;
            }>;
        }>, "strip", z.ZodTypeAny, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>]>, "many">;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, any> | undefined;
    }, {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, any> | undefined;
    }>, "many">>;
}, {
    /** @deprecated All responses now return a single candidate. This will always be `undefined`. */
    candidates: z.ZodOptional<z.ZodNumber>;
}>, "strip", z.ZodTypeAny, {
    messages: {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }[];
    docs?: {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, any> | undefined;
    }[] | undefined;
    tools?: {
        name: string;
        description: string;
        metadata?: Record<string, any> | undefined;
        inputSchema?: Record<string, any> | null | undefined;
        outputSchema?: Record<string, any> | null | undefined;
    }[] | undefined;
    toolChoice?: "auto" | "required" | "none" | undefined;
    config?: any;
    output?: {
        contentType?: string | undefined;
        format?: string | undefined;
        schema?: Record<string, any> | undefined;
        constrained?: boolean | undefined;
    } | undefined;
    candidates?: number | undefined;
}, {
    messages: {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }[];
    docs?: {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, any> | undefined;
    }[] | undefined;
    tools?: {
        name: string;
        description: string;
        metadata?: Record<string, any> | undefined;
        inputSchema?: Record<string, any> | null | undefined;
        outputSchema?: Record<string, any> | null | undefined;
    }[] | undefined;
    toolChoice?: "auto" | "required" | "none" | undefined;
    config?: any;
    output?: {
        contentType?: string | undefined;
        format?: string | undefined;
        schema?: Record<string, any> | undefined;
        constrained?: boolean | undefined;
    } | undefined;
    candidates?: number | undefined;
}>;
/**
 * Generate request data.
 */
type GenerateRequestData = z.infer<typeof GenerateRequestSchema>;
/**
 * Generate request.
 */
interface GenerateRequest<CustomOptionsSchema extends z.ZodTypeAny = z.ZodTypeAny> extends z.infer<typeof GenerateRequestSchema> {
    config?: z.infer<CustomOptionsSchema>;
}
/**
 * Zod schema of usage info from a generate request.
 */
declare const GenerationUsageSchema: z.ZodObject<{
    inputTokens: z.ZodOptional<z.ZodNumber>;
    outputTokens: z.ZodOptional<z.ZodNumber>;
    totalTokens: z.ZodOptional<z.ZodNumber>;
    inputCharacters: z.ZodOptional<z.ZodNumber>;
    outputCharacters: z.ZodOptional<z.ZodNumber>;
    inputImages: z.ZodOptional<z.ZodNumber>;
    outputImages: z.ZodOptional<z.ZodNumber>;
    inputVideos: z.ZodOptional<z.ZodNumber>;
    outputVideos: z.ZodOptional<z.ZodNumber>;
    inputAudioFiles: z.ZodOptional<z.ZodNumber>;
    outputAudioFiles: z.ZodOptional<z.ZodNumber>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    custom?: Record<string, number> | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    inputCharacters?: number | undefined;
    outputCharacters?: number | undefined;
    inputImages?: number | undefined;
    outputImages?: number | undefined;
    inputVideos?: number | undefined;
    outputVideos?: number | undefined;
    inputAudioFiles?: number | undefined;
    outputAudioFiles?: number | undefined;
}, {
    custom?: Record<string, number> | undefined;
    inputTokens?: number | undefined;
    outputTokens?: number | undefined;
    totalTokens?: number | undefined;
    inputCharacters?: number | undefined;
    outputCharacters?: number | undefined;
    inputImages?: number | undefined;
    outputImages?: number | undefined;
    inputVideos?: number | undefined;
    outputVideos?: number | undefined;
    inputAudioFiles?: number | undefined;
    outputAudioFiles?: number | undefined;
}>;
/**
 * Usage info from a generate request.
 */
type GenerationUsage = z.infer<typeof GenerationUsageSchema>;
/** Model response finish reason enum. */
declare const FinishReasonSchema: z.ZodEnum<["stop", "length", "blocked", "interrupted", "other", "unknown"]>;
/** @deprecated All responses now return a single candidate. Only the first candidate will be used if supplied. */
declare const CandidateSchema: z.ZodObject<{
    index: z.ZodNumber;
    message: z.ZodObject<{
        role: z.ZodEnum<["system", "user", "model", "tool"]>;
        content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            text: z.ZodString;
        }>, "strip", z.ZodTypeAny, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            media: z.ZodObject<{
                contentType: z.ZodOptional<z.ZodString>;
                url: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                url: string;
                contentType?: string | undefined;
            }, {
                url: string;
                contentType?: string | undefined;
            }>;
        }>, "strip", z.ZodTypeAny, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            toolRequest: z.ZodObject<{
                ref: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                input: z.ZodOptional<z.ZodUnknown>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            }, {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            }>;
        }>, "strip", z.ZodTypeAny, {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            toolResponse: z.ZodObject<{
                ref: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                output: z.ZodOptional<z.ZodUnknown>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            }, {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            }>;
        }>, "strip", z.ZodTypeAny, {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            data: z.ZodUnknown;
        }>, "strip", z.ZodTypeAny, {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            custom: z.ZodRecord<z.ZodString, z.ZodAny>;
        }>, "strip", z.ZodTypeAny, {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>]>, "many">;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }, {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }>;
    usage: z.ZodOptional<z.ZodObject<{
        inputTokens: z.ZodOptional<z.ZodNumber>;
        outputTokens: z.ZodOptional<z.ZodNumber>;
        totalTokens: z.ZodOptional<z.ZodNumber>;
        inputCharacters: z.ZodOptional<z.ZodNumber>;
        outputCharacters: z.ZodOptional<z.ZodNumber>;
        inputImages: z.ZodOptional<z.ZodNumber>;
        outputImages: z.ZodOptional<z.ZodNumber>;
        inputVideos: z.ZodOptional<z.ZodNumber>;
        outputVideos: z.ZodOptional<z.ZodNumber>;
        inputAudioFiles: z.ZodOptional<z.ZodNumber>;
        outputAudioFiles: z.ZodOptional<z.ZodNumber>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        custom?: Record<string, number> | undefined;
        inputTokens?: number | undefined;
        outputTokens?: number | undefined;
        totalTokens?: number | undefined;
        inputCharacters?: number | undefined;
        outputCharacters?: number | undefined;
        inputImages?: number | undefined;
        outputImages?: number | undefined;
        inputVideos?: number | undefined;
        outputVideos?: number | undefined;
        inputAudioFiles?: number | undefined;
        outputAudioFiles?: number | undefined;
    }, {
        custom?: Record<string, number> | undefined;
        inputTokens?: number | undefined;
        outputTokens?: number | undefined;
        totalTokens?: number | undefined;
        inputCharacters?: number | undefined;
        outputCharacters?: number | undefined;
        inputImages?: number | undefined;
        outputImages?: number | undefined;
        inputVideos?: number | undefined;
        outputVideos?: number | undefined;
        inputAudioFiles?: number | undefined;
        outputAudioFiles?: number | undefined;
    }>>;
    finishReason: z.ZodEnum<["stop", "length", "blocked", "interrupted", "other", "unknown"]>;
    finishMessage: z.ZodOptional<z.ZodString>;
    custom: z.ZodUnknown;
}, "strip", z.ZodTypeAny, {
    message: {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    };
    finishReason: "length" | "unknown" | "stop" | "blocked" | "interrupted" | "other";
    index: number;
    custom?: unknown;
    finishMessage?: string | undefined;
    usage?: {
        custom?: Record<string, number> | undefined;
        inputTokens?: number | undefined;
        outputTokens?: number | undefined;
        totalTokens?: number | undefined;
        inputCharacters?: number | undefined;
        outputCharacters?: number | undefined;
        inputImages?: number | undefined;
        outputImages?: number | undefined;
        inputVideos?: number | undefined;
        outputVideos?: number | undefined;
        inputAudioFiles?: number | undefined;
        outputAudioFiles?: number | undefined;
    } | undefined;
}, {
    message: {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    };
    finishReason: "length" | "unknown" | "stop" | "blocked" | "interrupted" | "other";
    index: number;
    custom?: unknown;
    finishMessage?: string | undefined;
    usage?: {
        custom?: Record<string, number> | undefined;
        inputTokens?: number | undefined;
        outputTokens?: number | undefined;
        totalTokens?: number | undefined;
        inputCharacters?: number | undefined;
        outputCharacters?: number | undefined;
        inputImages?: number | undefined;
        outputImages?: number | undefined;
        inputVideos?: number | undefined;
        outputVideos?: number | undefined;
        inputAudioFiles?: number | undefined;
        outputAudioFiles?: number | undefined;
    } | undefined;
}>;
/** @deprecated All responses now return a single candidate. Only the first candidate will be used if supplied. */
type CandidateData = z.infer<typeof CandidateSchema>;
/** @deprecated All responses now return a single candidate. Only the first candidate will be used if supplied. */
declare const CandidateErrorSchema: z.ZodObject<{
    index: z.ZodNumber;
    code: z.ZodEnum<["blocked", "other", "unknown"]>;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: "unknown" | "blocked" | "other";
    index: number;
    message?: string | undefined;
}, {
    code: "unknown" | "blocked" | "other";
    index: number;
    message?: string | undefined;
}>;
/** @deprecated All responses now return a single candidate. Only the first candidate will be used if supplied. */
type CandidateError = z.infer<typeof CandidateErrorSchema>;
/**
 * Zod schema of a model response.
 */
declare const ModelResponseSchema: z.ZodObject<{
    message: z.ZodOptional<z.ZodObject<{
        role: z.ZodEnum<["system", "user", "model", "tool"]>;
        content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            text: z.ZodString;
        }>, "strip", z.ZodTypeAny, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            media: z.ZodObject<{
                contentType: z.ZodOptional<z.ZodString>;
                url: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                url: string;
                contentType?: string | undefined;
            }, {
                url: string;
                contentType?: string | undefined;
            }>;
        }>, "strip", z.ZodTypeAny, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            toolRequest: z.ZodObject<{
                ref: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                input: z.ZodOptional<z.ZodUnknown>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            }, {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            }>;
        }>, "strip", z.ZodTypeAny, {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            toolResponse: z.ZodObject<{
                ref: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                output: z.ZodOptional<z.ZodUnknown>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            }, {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            }>;
        }>, "strip", z.ZodTypeAny, {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            data: z.ZodUnknown;
        }>, "strip", z.ZodTypeAny, {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            custom: z.ZodRecord<z.ZodString, z.ZodAny>;
        }>, "strip", z.ZodTypeAny, {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>]>, "many">;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }, {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }>>;
    finishReason: z.ZodEnum<["stop", "length", "blocked", "interrupted", "other", "unknown"]>;
    finishMessage: z.ZodOptional<z.ZodString>;
    latencyMs: z.ZodOptional<z.ZodNumber>;
    usage: z.ZodOptional<z.ZodObject<{
        inputTokens: z.ZodOptional<z.ZodNumber>;
        outputTokens: z.ZodOptional<z.ZodNumber>;
        totalTokens: z.ZodOptional<z.ZodNumber>;
        inputCharacters: z.ZodOptional<z.ZodNumber>;
        outputCharacters: z.ZodOptional<z.ZodNumber>;
        inputImages: z.ZodOptional<z.ZodNumber>;
        outputImages: z.ZodOptional<z.ZodNumber>;
        inputVideos: z.ZodOptional<z.ZodNumber>;
        outputVideos: z.ZodOptional<z.ZodNumber>;
        inputAudioFiles: z.ZodOptional<z.ZodNumber>;
        outputAudioFiles: z.ZodOptional<z.ZodNumber>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        custom?: Record<string, number> | undefined;
        inputTokens?: number | undefined;
        outputTokens?: number | undefined;
        totalTokens?: number | undefined;
        inputCharacters?: number | undefined;
        outputCharacters?: number | undefined;
        inputImages?: number | undefined;
        outputImages?: number | undefined;
        inputVideos?: number | undefined;
        outputVideos?: number | undefined;
        inputAudioFiles?: number | undefined;
        outputAudioFiles?: number | undefined;
    }, {
        custom?: Record<string, number> | undefined;
        inputTokens?: number | undefined;
        outputTokens?: number | undefined;
        totalTokens?: number | undefined;
        inputCharacters?: number | undefined;
        outputCharacters?: number | undefined;
        inputImages?: number | undefined;
        outputImages?: number | undefined;
        inputVideos?: number | undefined;
        outputVideos?: number | undefined;
        inputAudioFiles?: number | undefined;
        outputAudioFiles?: number | undefined;
    }>>;
    /** @deprecated use `raw` instead */
    custom: z.ZodUnknown;
    raw: z.ZodUnknown;
    request: z.ZodOptional<z.ZodObject<z.objectUtil.extendShape<{
        messages: z.ZodArray<z.ZodObject<{
            role: z.ZodEnum<["system", "user", "model", "tool"]>;
            content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                text: z.ZodString;
            }>, "strip", z.ZodTypeAny, {
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>, z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                media: z.ZodObject<{
                    contentType: z.ZodOptional<z.ZodString>;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    url: string;
                    contentType?: string | undefined;
                }, {
                    url: string;
                    contentType?: string | undefined;
                }>;
            }>, "strip", z.ZodTypeAny, {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>, z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                toolRequest: z.ZodObject<{
                    ref: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    input: z.ZodOptional<z.ZodUnknown>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                }, {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                }>;
            }>, "strip", z.ZodTypeAny, {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>, z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                toolResponse: z.ZodObject<{
                    ref: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    output: z.ZodOptional<z.ZodUnknown>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                }, {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                }>;
            }>, "strip", z.ZodTypeAny, {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>, z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                data: z.ZodUnknown;
            }>, "strip", z.ZodTypeAny, {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>, z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                custom: z.ZodRecord<z.ZodString, z.ZodAny>;
            }>, "strip", z.ZodTypeAny, {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>]>, "many">;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        }, {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        }>, "many">;
        config: z.ZodOptional<z.ZodAny>;
        tools: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            inputSchema: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>>;
            outputSchema: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            metadata?: Record<string, any> | undefined;
            inputSchema?: Record<string, any> | null | undefined;
            outputSchema?: Record<string, any> | null | undefined;
        }, {
            name: string;
            description: string;
            metadata?: Record<string, any> | undefined;
            inputSchema?: Record<string, any> | null | undefined;
            outputSchema?: Record<string, any> | null | undefined;
        }>, "many">>;
        toolChoice: z.ZodOptional<z.ZodEnum<["auto", "required", "none"]>>;
        output: z.ZodOptional<z.ZodObject<{
            format: z.ZodOptional<z.ZodString>;
            schema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            constrained: z.ZodOptional<z.ZodBoolean>;
            contentType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            contentType?: string | undefined;
            format?: string | undefined;
            schema?: Record<string, any> | undefined;
            constrained?: boolean | undefined;
        }, {
            contentType?: string | undefined;
            format?: string | undefined;
            schema?: Record<string, any> | undefined;
            constrained?: boolean | undefined;
        }>>;
        docs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                text: z.ZodString;
            }>, "strip", z.ZodTypeAny, {
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>, z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                media: z.ZodObject<{
                    contentType: z.ZodOptional<z.ZodString>;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    url: string;
                    contentType?: string | undefined;
                }, {
                    url: string;
                    contentType?: string | undefined;
                }>;
            }>, "strip", z.ZodTypeAny, {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>]>, "many">;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, any> | undefined;
        }, {
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, any> | undefined;
        }>, "many">>;
    }, {
        /** @deprecated All responses now return a single candidate. This will always be `undefined`. */
        candidates: z.ZodOptional<z.ZodNumber>;
    }>, "strip", z.ZodTypeAny, {
        messages: {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        }[];
        docs?: {
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, any> | undefined;
        }[] | undefined;
        tools?: {
            name: string;
            description: string;
            metadata?: Record<string, any> | undefined;
            inputSchema?: Record<string, any> | null | undefined;
            outputSchema?: Record<string, any> | null | undefined;
        }[] | undefined;
        toolChoice?: "auto" | "required" | "none" | undefined;
        config?: any;
        output?: {
            contentType?: string | undefined;
            format?: string | undefined;
            schema?: Record<string, any> | undefined;
            constrained?: boolean | undefined;
        } | undefined;
        candidates?: number | undefined;
    }, {
        messages: {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        }[];
        docs?: {
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, any> | undefined;
        }[] | undefined;
        tools?: {
            name: string;
            description: string;
            metadata?: Record<string, any> | undefined;
            inputSchema?: Record<string, any> | null | undefined;
            outputSchema?: Record<string, any> | null | undefined;
        }[] | undefined;
        toolChoice?: "auto" | "required" | "none" | undefined;
        config?: any;
        output?: {
            contentType?: string | undefined;
            format?: string | undefined;
            schema?: Record<string, any> | undefined;
            constrained?: boolean | undefined;
        } | undefined;
        candidates?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    finishReason: "length" | "unknown" | "stop" | "blocked" | "interrupted" | "other";
    message?: {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    } | undefined;
    custom?: unknown;
    finishMessage?: string | undefined;
    latencyMs?: number | undefined;
    usage?: {
        custom?: Record<string, number> | undefined;
        inputTokens?: number | undefined;
        outputTokens?: number | undefined;
        totalTokens?: number | undefined;
        inputCharacters?: number | undefined;
        outputCharacters?: number | undefined;
        inputImages?: number | undefined;
        outputImages?: number | undefined;
        inputVideos?: number | undefined;
        outputVideos?: number | undefined;
        inputAudioFiles?: number | undefined;
        outputAudioFiles?: number | undefined;
    } | undefined;
    raw?: unknown;
    request?: {
        messages: {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        }[];
        docs?: {
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, any> | undefined;
        }[] | undefined;
        tools?: {
            name: string;
            description: string;
            metadata?: Record<string, any> | undefined;
            inputSchema?: Record<string, any> | null | undefined;
            outputSchema?: Record<string, any> | null | undefined;
        }[] | undefined;
        toolChoice?: "auto" | "required" | "none" | undefined;
        config?: any;
        output?: {
            contentType?: string | undefined;
            format?: string | undefined;
            schema?: Record<string, any> | undefined;
            constrained?: boolean | undefined;
        } | undefined;
        candidates?: number | undefined;
    } | undefined;
}, {
    finishReason: "length" | "unknown" | "stop" | "blocked" | "interrupted" | "other";
    message?: {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    } | undefined;
    custom?: unknown;
    finishMessage?: string | undefined;
    latencyMs?: number | undefined;
    usage?: {
        custom?: Record<string, number> | undefined;
        inputTokens?: number | undefined;
        outputTokens?: number | undefined;
        totalTokens?: number | undefined;
        inputCharacters?: number | undefined;
        outputCharacters?: number | undefined;
        inputImages?: number | undefined;
        outputImages?: number | undefined;
        inputVideos?: number | undefined;
        outputVideos?: number | undefined;
        inputAudioFiles?: number | undefined;
        outputAudioFiles?: number | undefined;
    } | undefined;
    raw?: unknown;
    request?: {
        messages: {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        }[];
        docs?: {
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, any> | undefined;
        }[] | undefined;
        tools?: {
            name: string;
            description: string;
            metadata?: Record<string, any> | undefined;
            inputSchema?: Record<string, any> | null | undefined;
            outputSchema?: Record<string, any> | null | undefined;
        }[] | undefined;
        toolChoice?: "auto" | "required" | "none" | undefined;
        config?: any;
        output?: {
            contentType?: string | undefined;
            format?: string | undefined;
            schema?: Record<string, any> | undefined;
            constrained?: boolean | undefined;
        } | undefined;
        candidates?: number | undefined;
    } | undefined;
}>;
/**
 * Model response data.
 */
type ModelResponseData = z.infer<typeof ModelResponseSchema>;
/**
 * Zod schema of generaete response.
 */
declare const GenerateResponseSchema: z.ZodObject<z.objectUtil.extendShape<{
    message: z.ZodOptional<z.ZodObject<{
        role: z.ZodEnum<["system", "user", "model", "tool"]>;
        content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            text: z.ZodString;
        }>, "strip", z.ZodTypeAny, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            media: z.ZodObject<{
                contentType: z.ZodOptional<z.ZodString>;
                url: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                url: string;
                contentType?: string | undefined;
            }, {
                url: string;
                contentType?: string | undefined;
            }>;
        }>, "strip", z.ZodTypeAny, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            toolRequest: z.ZodObject<{
                ref: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                input: z.ZodOptional<z.ZodUnknown>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            }, {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            }>;
        }>, "strip", z.ZodTypeAny, {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            toolResponse: z.ZodObject<{
                ref: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                output: z.ZodOptional<z.ZodUnknown>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            }, {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            }>;
        }>, "strip", z.ZodTypeAny, {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            data: z.ZodUnknown;
        }>, "strip", z.ZodTypeAny, {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            custom: z.ZodRecord<z.ZodString, z.ZodAny>;
        }>, "strip", z.ZodTypeAny, {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>]>, "many">;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }, {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }>>;
    finishReason: z.ZodEnum<["stop", "length", "blocked", "interrupted", "other", "unknown"]>;
    finishMessage: z.ZodOptional<z.ZodString>;
    latencyMs: z.ZodOptional<z.ZodNumber>;
    usage: z.ZodOptional<z.ZodObject<{
        inputTokens: z.ZodOptional<z.ZodNumber>;
        outputTokens: z.ZodOptional<z.ZodNumber>;
        totalTokens: z.ZodOptional<z.ZodNumber>;
        inputCharacters: z.ZodOptional<z.ZodNumber>;
        outputCharacters: z.ZodOptional<z.ZodNumber>;
        inputImages: z.ZodOptional<z.ZodNumber>;
        outputImages: z.ZodOptional<z.ZodNumber>;
        inputVideos: z.ZodOptional<z.ZodNumber>;
        outputVideos: z.ZodOptional<z.ZodNumber>;
        inputAudioFiles: z.ZodOptional<z.ZodNumber>;
        outputAudioFiles: z.ZodOptional<z.ZodNumber>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        custom?: Record<string, number> | undefined;
        inputTokens?: number | undefined;
        outputTokens?: number | undefined;
        totalTokens?: number | undefined;
        inputCharacters?: number | undefined;
        outputCharacters?: number | undefined;
        inputImages?: number | undefined;
        outputImages?: number | undefined;
        inputVideos?: number | undefined;
        outputVideos?: number | undefined;
        inputAudioFiles?: number | undefined;
        outputAudioFiles?: number | undefined;
    }, {
        custom?: Record<string, number> | undefined;
        inputTokens?: number | undefined;
        outputTokens?: number | undefined;
        totalTokens?: number | undefined;
        inputCharacters?: number | undefined;
        outputCharacters?: number | undefined;
        inputImages?: number | undefined;
        outputImages?: number | undefined;
        inputVideos?: number | undefined;
        outputVideos?: number | undefined;
        inputAudioFiles?: number | undefined;
        outputAudioFiles?: number | undefined;
    }>>;
    /** @deprecated use `raw` instead */
    custom: z.ZodUnknown;
    raw: z.ZodUnknown;
    request: z.ZodOptional<z.ZodObject<z.objectUtil.extendShape<{
        messages: z.ZodArray<z.ZodObject<{
            role: z.ZodEnum<["system", "user", "model", "tool"]>;
            content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                text: z.ZodString;
            }>, "strip", z.ZodTypeAny, {
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>, z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                media: z.ZodObject<{
                    contentType: z.ZodOptional<z.ZodString>;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    url: string;
                    contentType?: string | undefined;
                }, {
                    url: string;
                    contentType?: string | undefined;
                }>;
            }>, "strip", z.ZodTypeAny, {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>, z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                toolRequest: z.ZodObject<{
                    ref: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    input: z.ZodOptional<z.ZodUnknown>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                }, {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                }>;
            }>, "strip", z.ZodTypeAny, {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>, z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                toolResponse: z.ZodObject<{
                    ref: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    output: z.ZodOptional<z.ZodUnknown>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                }, {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                }>;
            }>, "strip", z.ZodTypeAny, {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>, z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                data: z.ZodUnknown;
            }>, "strip", z.ZodTypeAny, {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>, z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                custom: z.ZodRecord<z.ZodString, z.ZodAny>;
            }>, "strip", z.ZodTypeAny, {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>]>, "many">;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        }, {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        }>, "many">;
        config: z.ZodOptional<z.ZodAny>;
        tools: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            inputSchema: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>>;
            outputSchema: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description: string;
            metadata?: Record<string, any> | undefined;
            inputSchema?: Record<string, any> | null | undefined;
            outputSchema?: Record<string, any> | null | undefined;
        }, {
            name: string;
            description: string;
            metadata?: Record<string, any> | undefined;
            inputSchema?: Record<string, any> | null | undefined;
            outputSchema?: Record<string, any> | null | undefined;
        }>, "many">>;
        toolChoice: z.ZodOptional<z.ZodEnum<["auto", "required", "none"]>>;
        output: z.ZodOptional<z.ZodObject<{
            format: z.ZodOptional<z.ZodString>;
            schema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            constrained: z.ZodOptional<z.ZodBoolean>;
            contentType: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            contentType?: string | undefined;
            format?: string | undefined;
            schema?: Record<string, any> | undefined;
            constrained?: boolean | undefined;
        }, {
            contentType?: string | undefined;
            format?: string | undefined;
            schema?: Record<string, any> | undefined;
            constrained?: boolean | undefined;
        }>>;
        docs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                text: z.ZodString;
            }>, "strip", z.ZodTypeAny, {
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>, z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                media: z.ZodObject<{
                    contentType: z.ZodOptional<z.ZodString>;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    url: string;
                    contentType?: string | undefined;
                }, {
                    url: string;
                    contentType?: string | undefined;
                }>;
            }>, "strip", z.ZodTypeAny, {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>]>, "many">;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, any> | undefined;
        }, {
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, any> | undefined;
        }>, "many">>;
    }, {
        /** @deprecated All responses now return a single candidate. This will always be `undefined`. */
        candidates: z.ZodOptional<z.ZodNumber>;
    }>, "strip", z.ZodTypeAny, {
        messages: {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        }[];
        docs?: {
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, any> | undefined;
        }[] | undefined;
        tools?: {
            name: string;
            description: string;
            metadata?: Record<string, any> | undefined;
            inputSchema?: Record<string, any> | null | undefined;
            outputSchema?: Record<string, any> | null | undefined;
        }[] | undefined;
        toolChoice?: "auto" | "required" | "none" | undefined;
        config?: any;
        output?: {
            contentType?: string | undefined;
            format?: string | undefined;
            schema?: Record<string, any> | undefined;
            constrained?: boolean | undefined;
        } | undefined;
        candidates?: number | undefined;
    }, {
        messages: {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        }[];
        docs?: {
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, any> | undefined;
        }[] | undefined;
        tools?: {
            name: string;
            description: string;
            metadata?: Record<string, any> | undefined;
            inputSchema?: Record<string, any> | null | undefined;
            outputSchema?: Record<string, any> | null | undefined;
        }[] | undefined;
        toolChoice?: "auto" | "required" | "none" | undefined;
        config?: any;
        output?: {
            contentType?: string | undefined;
            format?: string | undefined;
            schema?: Record<string, any> | undefined;
            constrained?: boolean | undefined;
        } | undefined;
        candidates?: number | undefined;
    }>>;
}, {
    /** @deprecated All responses now return a single candidate. Only the first candidate will be used if supplied. Return `message`, `finishReason`, and `finishMessage` instead. */
    candidates: z.ZodOptional<z.ZodArray<z.ZodObject<{
        index: z.ZodNumber;
        message: z.ZodObject<{
            role: z.ZodEnum<["system", "user", "model", "tool"]>;
            content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                text: z.ZodString;
            }>, "strip", z.ZodTypeAny, {
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>, z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                media: z.ZodObject<{
                    contentType: z.ZodOptional<z.ZodString>;
                    url: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    url: string;
                    contentType?: string | undefined;
                }, {
                    url: string;
                    contentType?: string | undefined;
                }>;
            }>, "strip", z.ZodTypeAny, {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>, z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                toolRequest: z.ZodObject<{
                    ref: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    input: z.ZodOptional<z.ZodUnknown>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                }, {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                }>;
            }>, "strip", z.ZodTypeAny, {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>, z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                toolResponse: z.ZodObject<{
                    ref: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    output: z.ZodOptional<z.ZodUnknown>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                }, {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                }>;
            }>, "strip", z.ZodTypeAny, {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>, z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                data: z.ZodUnknown;
            }>, "strip", z.ZodTypeAny, {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>, z.ZodObject<z.objectUtil.extendShape<{
                text: z.ZodOptional<z.ZodNever>;
                media: z.ZodOptional<z.ZodNever>;
                toolRequest: z.ZodOptional<z.ZodNever>;
                toolResponse: z.ZodOptional<z.ZodNever>;
                data: z.ZodOptional<z.ZodUnknown>;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, {
                custom: z.ZodRecord<z.ZodString, z.ZodAny>;
            }>, "strip", z.ZodTypeAny, {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }, {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            }>]>, "many">;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        }, {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        }>;
        usage: z.ZodOptional<z.ZodObject<{
            inputTokens: z.ZodOptional<z.ZodNumber>;
            outputTokens: z.ZodOptional<z.ZodNumber>;
            totalTokens: z.ZodOptional<z.ZodNumber>;
            inputCharacters: z.ZodOptional<z.ZodNumber>;
            outputCharacters: z.ZodOptional<z.ZodNumber>;
            inputImages: z.ZodOptional<z.ZodNumber>;
            outputImages: z.ZodOptional<z.ZodNumber>;
            inputVideos: z.ZodOptional<z.ZodNumber>;
            outputVideos: z.ZodOptional<z.ZodNumber>;
            inputAudioFiles: z.ZodOptional<z.ZodNumber>;
            outputAudioFiles: z.ZodOptional<z.ZodNumber>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            custom?: Record<string, number> | undefined;
            inputTokens?: number | undefined;
            outputTokens?: number | undefined;
            totalTokens?: number | undefined;
            inputCharacters?: number | undefined;
            outputCharacters?: number | undefined;
            inputImages?: number | undefined;
            outputImages?: number | undefined;
            inputVideos?: number | undefined;
            outputVideos?: number | undefined;
            inputAudioFiles?: number | undefined;
            outputAudioFiles?: number | undefined;
        }, {
            custom?: Record<string, number> | undefined;
            inputTokens?: number | undefined;
            outputTokens?: number | undefined;
            totalTokens?: number | undefined;
            inputCharacters?: number | undefined;
            outputCharacters?: number | undefined;
            inputImages?: number | undefined;
            outputImages?: number | undefined;
            inputVideos?: number | undefined;
            outputVideos?: number | undefined;
            inputAudioFiles?: number | undefined;
            outputAudioFiles?: number | undefined;
        }>>;
        finishReason: z.ZodEnum<["stop", "length", "blocked", "interrupted", "other", "unknown"]>;
        finishMessage: z.ZodOptional<z.ZodString>;
        custom: z.ZodUnknown;
    }, "strip", z.ZodTypeAny, {
        message: {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        };
        finishReason: "length" | "unknown" | "stop" | "blocked" | "interrupted" | "other";
        index: number;
        custom?: unknown;
        finishMessage?: string | undefined;
        usage?: {
            custom?: Record<string, number> | undefined;
            inputTokens?: number | undefined;
            outputTokens?: number | undefined;
            totalTokens?: number | undefined;
            inputCharacters?: number | undefined;
            outputCharacters?: number | undefined;
            inputImages?: number | undefined;
            outputImages?: number | undefined;
            inputVideos?: number | undefined;
            outputVideos?: number | undefined;
            inputAudioFiles?: number | undefined;
            outputAudioFiles?: number | undefined;
        } | undefined;
    }, {
        message: {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        };
        finishReason: "length" | "unknown" | "stop" | "blocked" | "interrupted" | "other";
        index: number;
        custom?: unknown;
        finishMessage?: string | undefined;
        usage?: {
            custom?: Record<string, number> | undefined;
            inputTokens?: number | undefined;
            outputTokens?: number | undefined;
            totalTokens?: number | undefined;
            inputCharacters?: number | undefined;
            outputCharacters?: number | undefined;
            inputImages?: number | undefined;
            outputImages?: number | undefined;
            inputVideos?: number | undefined;
            outputVideos?: number | undefined;
            inputAudioFiles?: number | undefined;
            outputAudioFiles?: number | undefined;
        } | undefined;
    }>, "many">>;
    finishReason: z.ZodOptional<z.ZodEnum<["stop", "length", "blocked", "interrupted", "other", "unknown"]>>;
}>, "strip", z.ZodTypeAny, {
    message?: {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    } | undefined;
    custom?: unknown;
    candidates?: {
        message: {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        };
        finishReason: "length" | "unknown" | "stop" | "blocked" | "interrupted" | "other";
        index: number;
        custom?: unknown;
        finishMessage?: string | undefined;
        usage?: {
            custom?: Record<string, number> | undefined;
            inputTokens?: number | undefined;
            outputTokens?: number | undefined;
            totalTokens?: number | undefined;
            inputCharacters?: number | undefined;
            outputCharacters?: number | undefined;
            inputImages?: number | undefined;
            outputImages?: number | undefined;
            inputVideos?: number | undefined;
            outputVideos?: number | undefined;
            inputAudioFiles?: number | undefined;
            outputAudioFiles?: number | undefined;
        } | undefined;
    }[] | undefined;
    finishReason?: "length" | "unknown" | "stop" | "blocked" | "interrupted" | "other" | undefined;
    finishMessage?: string | undefined;
    latencyMs?: number | undefined;
    usage?: {
        custom?: Record<string, number> | undefined;
        inputTokens?: number | undefined;
        outputTokens?: number | undefined;
        totalTokens?: number | undefined;
        inputCharacters?: number | undefined;
        outputCharacters?: number | undefined;
        inputImages?: number | undefined;
        outputImages?: number | undefined;
        inputVideos?: number | undefined;
        outputVideos?: number | undefined;
        inputAudioFiles?: number | undefined;
        outputAudioFiles?: number | undefined;
    } | undefined;
    raw?: unknown;
    request?: {
        messages: {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        }[];
        docs?: {
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, any> | undefined;
        }[] | undefined;
        tools?: {
            name: string;
            description: string;
            metadata?: Record<string, any> | undefined;
            inputSchema?: Record<string, any> | null | undefined;
            outputSchema?: Record<string, any> | null | undefined;
        }[] | undefined;
        toolChoice?: "auto" | "required" | "none" | undefined;
        config?: any;
        output?: {
            contentType?: string | undefined;
            format?: string | undefined;
            schema?: Record<string, any> | undefined;
            constrained?: boolean | undefined;
        } | undefined;
        candidates?: number | undefined;
    } | undefined;
}, {
    message?: {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    } | undefined;
    custom?: unknown;
    candidates?: {
        message: {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        };
        finishReason: "length" | "unknown" | "stop" | "blocked" | "interrupted" | "other";
        index: number;
        custom?: unknown;
        finishMessage?: string | undefined;
        usage?: {
            custom?: Record<string, number> | undefined;
            inputTokens?: number | undefined;
            outputTokens?: number | undefined;
            totalTokens?: number | undefined;
            inputCharacters?: number | undefined;
            outputCharacters?: number | undefined;
            inputImages?: number | undefined;
            outputImages?: number | undefined;
            inputVideos?: number | undefined;
            outputVideos?: number | undefined;
            inputAudioFiles?: number | undefined;
            outputAudioFiles?: number | undefined;
        } | undefined;
    }[] | undefined;
    finishReason?: "length" | "unknown" | "stop" | "blocked" | "interrupted" | "other" | undefined;
    finishMessage?: string | undefined;
    latencyMs?: number | undefined;
    usage?: {
        custom?: Record<string, number> | undefined;
        inputTokens?: number | undefined;
        outputTokens?: number | undefined;
        totalTokens?: number | undefined;
        inputCharacters?: number | undefined;
        outputCharacters?: number | undefined;
        inputImages?: number | undefined;
        outputImages?: number | undefined;
        inputVideos?: number | undefined;
        outputVideos?: number | undefined;
        inputAudioFiles?: number | undefined;
        outputAudioFiles?: number | undefined;
    } | undefined;
    raw?: unknown;
    request?: {
        messages: {
            role: "model" | "system" | "user" | "tool";
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolRequest: {
                    name: string;
                    ref?: string | undefined;
                    input?: unknown;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                toolResponse: {
                    name: string;
                    output?: unknown;
                    ref?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                custom: Record<string, any>;
                text?: undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, unknown> | undefined;
        }[];
        docs?: {
            content: ({
                text: string;
                custom?: Record<string, unknown> | undefined;
                media?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            } | {
                media: {
                    url: string;
                    contentType?: string | undefined;
                };
                custom?: Record<string, unknown> | undefined;
                text?: undefined;
                toolRequest?: undefined;
                toolResponse?: undefined;
                data?: unknown;
                metadata?: Record<string, unknown> | undefined;
            })[];
            metadata?: Record<string, any> | undefined;
        }[] | undefined;
        tools?: {
            name: string;
            description: string;
            metadata?: Record<string, any> | undefined;
            inputSchema?: Record<string, any> | null | undefined;
            outputSchema?: Record<string, any> | null | undefined;
        }[] | undefined;
        toolChoice?: "auto" | "required" | "none" | undefined;
        config?: any;
        output?: {
            contentType?: string | undefined;
            format?: string | undefined;
            schema?: Record<string, any> | undefined;
            constrained?: boolean | undefined;
        } | undefined;
        candidates?: number | undefined;
    } | undefined;
}>;
/**
 * Generate response data.
 */
type GenerateResponseData = z.infer<typeof GenerateResponseSchema>;
/** ModelResponseChunkSchema represents a chunk of content to stream to the client. */
declare const ModelResponseChunkSchema: z.ZodObject<{
    role: z.ZodOptional<z.ZodEnum<["system", "user", "model", "tool"]>>;
    /** index of the message this chunk belongs to. */
    index: z.ZodOptional<z.ZodNumber>;
    /** The chunk of content to stream right now. */
    content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        text: z.ZodString;
    }>, "strip", z.ZodTypeAny, {
        text: string;
        custom?: Record<string, unknown> | undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        text: string;
        custom?: Record<string, unknown> | undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>, z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        media: z.ZodObject<{
            contentType: z.ZodOptional<z.ZodString>;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            url: string;
            contentType?: string | undefined;
        }, {
            url: string;
            contentType?: string | undefined;
        }>;
    }>, "strip", z.ZodTypeAny, {
        media: {
            url: string;
            contentType?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        media: {
            url: string;
            contentType?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>, z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        toolRequest: z.ZodObject<{
            ref: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            input: z.ZodOptional<z.ZodUnknown>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        }, {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        }>;
    }>, "strip", z.ZodTypeAny, {
        toolRequest: {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        toolRequest: {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>, z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        toolResponse: z.ZodObject<{
            ref: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            output: z.ZodOptional<z.ZodUnknown>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        }, {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        }>;
    }>, "strip", z.ZodTypeAny, {
        toolResponse: {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        toolResponse: {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>, z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        data: z.ZodUnknown;
    }>, "strip", z.ZodTypeAny, {
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>, z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        custom: z.ZodRecord<z.ZodString, z.ZodAny>;
    }>, "strip", z.ZodTypeAny, {
        custom: Record<string, any>;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        custom: Record<string, any>;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>]>, "many">;
    /** Model-specific extra information attached to this chunk. */
    custom: z.ZodOptional<z.ZodUnknown>;
    /** If true, the chunk includes all data from previous chunks. Otherwise, considered to be incremental. */
    aggregated: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    content: ({
        text: string;
        custom?: Record<string, unknown> | undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        media: {
            url: string;
            contentType?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        toolRequest: {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        toolResponse: {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        custom: Record<string, any>;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    })[];
    role?: "model" | "system" | "user" | "tool" | undefined;
    custom?: unknown;
    index?: number | undefined;
    aggregated?: boolean | undefined;
}, {
    content: ({
        text: string;
        custom?: Record<string, unknown> | undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        media: {
            url: string;
            contentType?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        toolRequest: {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        toolResponse: {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        custom: Record<string, any>;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    })[];
    role?: "model" | "system" | "user" | "tool" | undefined;
    custom?: unknown;
    index?: number | undefined;
    aggregated?: boolean | undefined;
}>;
type ModelResponseChunkData = z.infer<typeof ModelResponseChunkSchema>;
declare const GenerateResponseChunkSchema: z.ZodObject<{
    role: z.ZodOptional<z.ZodEnum<["system", "user", "model", "tool"]>>;
    /** index of the message this chunk belongs to. */
    index: z.ZodOptional<z.ZodNumber>;
    /** The chunk of content to stream right now. */
    content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        text: z.ZodString;
    }>, "strip", z.ZodTypeAny, {
        text: string;
        custom?: Record<string, unknown> | undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        text: string;
        custom?: Record<string, unknown> | undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>, z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        media: z.ZodObject<{
            contentType: z.ZodOptional<z.ZodString>;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            url: string;
            contentType?: string | undefined;
        }, {
            url: string;
            contentType?: string | undefined;
        }>;
    }>, "strip", z.ZodTypeAny, {
        media: {
            url: string;
            contentType?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        media: {
            url: string;
            contentType?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>, z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        toolRequest: z.ZodObject<{
            ref: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            input: z.ZodOptional<z.ZodUnknown>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        }, {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        }>;
    }>, "strip", z.ZodTypeAny, {
        toolRequest: {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        toolRequest: {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>, z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        toolResponse: z.ZodObject<{
            ref: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            output: z.ZodOptional<z.ZodUnknown>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        }, {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        }>;
    }>, "strip", z.ZodTypeAny, {
        toolResponse: {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        toolResponse: {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>, z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        data: z.ZodUnknown;
    }>, "strip", z.ZodTypeAny, {
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>, z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        custom: z.ZodRecord<z.ZodString, z.ZodAny>;
    }>, "strip", z.ZodTypeAny, {
        custom: Record<string, any>;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }, {
        custom: Record<string, any>;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    }>]>, "many">;
    /** Model-specific extra information attached to this chunk. */
    custom: z.ZodOptional<z.ZodUnknown>;
    /** If true, the chunk includes all data from previous chunks. Otherwise, considered to be incremental. */
    aggregated: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    content: ({
        text: string;
        custom?: Record<string, unknown> | undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        media: {
            url: string;
            contentType?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        toolRequest: {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        toolResponse: {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        custom: Record<string, any>;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    })[];
    role?: "model" | "system" | "user" | "tool" | undefined;
    custom?: unknown;
    index?: number | undefined;
    aggregated?: boolean | undefined;
}, {
    content: ({
        text: string;
        custom?: Record<string, unknown> | undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        media: {
            url: string;
            contentType?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        toolRequest: {
            name: string;
            ref?: string | undefined;
            input?: unknown;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        toolResponse: {
            name: string;
            output?: unknown;
            ref?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        custom?: Record<string, unknown> | undefined;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    } | {
        custom: Record<string, any>;
        text?: undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        metadata?: Record<string, unknown> | undefined;
    })[];
    role?: "model" | "system" | "user" | "tool" | undefined;
    custom?: unknown;
    index?: number | undefined;
    aggregated?: boolean | undefined;
}>;
type GenerateResponseChunkData = z.infer<typeof GenerateResponseChunkSchema>;
type ModelAction<CustomOptionsSchema extends z.ZodTypeAny = z.ZodTypeAny> = Action<typeof GenerateRequestSchema, typeof GenerateResponseSchema, typeof GenerateResponseChunkSchema> & {
    __configSchema: CustomOptionsSchema;
};
type ModelMiddleware = SimpleMiddleware<z.infer<typeof GenerateRequestSchema>, z.infer<typeof GenerateResponseSchema>>;
type DefineModelOptions<CustomOptionsSchema extends z.ZodTypeAny = z.ZodTypeAny> = {
    name: string;
    /** Known version names for this model, e.g. `gemini-1.0-pro-001`. */
    versions?: string[];
    /** Capabilities this model supports. */
    supports?: ModelInfo['supports'];
    /** Custom options schema for this model. */
    configSchema?: CustomOptionsSchema;
    /** Descriptive name for this model e.g. 'Google AI - Gemini Pro'. */
    label?: string;
    /** Middleware to be used with this model. */
    use?: ModelMiddleware[];
};
/**
 * Defines a new model and adds it to the registry.
 */
declare function defineModel<CustomOptionsSchema extends z.ZodTypeAny = z.ZodTypeAny>(registry: Registry, options: DefineModelOptions<CustomOptionsSchema>, runner: (request: GenerateRequest<CustomOptionsSchema>, streamingCallback?: StreamingCallback<GenerateResponseChunkData>) => Promise<GenerateResponseData>): ModelAction<CustomOptionsSchema>;
interface ModelReference<CustomOptions extends z.ZodTypeAny> {
    name: string;
    configSchema?: CustomOptions;
    info?: ModelInfo;
    version?: string;
    config?: z.infer<CustomOptions>;
    withConfig(cfg: z.infer<CustomOptions>): ModelReference<CustomOptions>;
    withVersion(version: string): ModelReference<CustomOptions>;
}
/** Cretes a model reference. */
declare function modelRef<CustomOptionsSchema extends z.ZodTypeAny = z.ZodTypeAny>(options: Omit<ModelReference<CustomOptionsSchema>, 'withConfig' | 'withVersion'>): ModelReference<CustomOptionsSchema>;
/**
 * Calculates basic usage statistics from the given model inputs and outputs.
 */
declare function getBasicUsageStats(input: MessageData[], response: MessageData | CandidateData[]): GenerationUsage;
type ModelArgument<CustomOptions extends z.ZodTypeAny = typeof GenerationCommonConfigSchema> = ModelAction<CustomOptions> | ModelReference<CustomOptions> | string;
interface ResolvedModel<CustomOptions extends z.ZodTypeAny = z.ZodTypeAny> {
    modelAction: ModelAction;
    config?: z.infer<CustomOptions>;
    version?: string;
}
declare function resolveModel<C extends z.ZodTypeAny = z.ZodTypeAny>(registry: Registry, model: ModelArgument<C> | undefined, options?: {
    warnDeprecated?: boolean;
}): Promise<ResolvedModel<C>>;
declare const GenerateActionOutputConfig: z.ZodObject<{
    format: z.ZodOptional<z.ZodString>;
    contentType: z.ZodOptional<z.ZodString>;
    instructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
    jsonSchema: z.ZodOptional<z.ZodAny>;
    constrained: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    contentType?: string | undefined;
    format?: string | undefined;
    constrained?: boolean | undefined;
    jsonSchema?: any;
    instructions?: string | boolean | undefined;
}, {
    contentType?: string | undefined;
    format?: string | undefined;
    constrained?: boolean | undefined;
    jsonSchema?: any;
    instructions?: string | boolean | undefined;
}>;
declare const GenerateActionOptionsSchema: z.ZodObject<{
    /** A model name (e.g. `vertexai/gemini-1.0-pro`). */
    model: z.ZodString;
    /** Retrieved documents to be used as context for this generation. */
    docs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            text: z.ZodString;
        }>, "strip", z.ZodTypeAny, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            media: z.ZodObject<{
                contentType: z.ZodOptional<z.ZodString>;
                url: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                url: string;
                contentType?: string | undefined;
            }, {
                url: string;
                contentType?: string | undefined;
            }>;
        }>, "strip", z.ZodTypeAny, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>]>, "many">;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, any> | undefined;
    }, {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, any> | undefined;
    }>, "many">>;
    /** Conversation history for multi-turn prompting when supported by the underlying model. */
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["system", "user", "model", "tool"]>;
        content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            text: z.ZodString;
        }>, "strip", z.ZodTypeAny, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            media: z.ZodObject<{
                contentType: z.ZodOptional<z.ZodString>;
                url: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                url: string;
                contentType?: string | undefined;
            }, {
                url: string;
                contentType?: string | undefined;
            }>;
        }>, "strip", z.ZodTypeAny, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            toolRequest: z.ZodObject<{
                ref: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                input: z.ZodOptional<z.ZodUnknown>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            }, {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            }>;
        }>, "strip", z.ZodTypeAny, {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            toolResponse: z.ZodObject<{
                ref: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                output: z.ZodOptional<z.ZodUnknown>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            }, {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            }>;
        }>, "strip", z.ZodTypeAny, {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            data: z.ZodUnknown;
        }>, "strip", z.ZodTypeAny, {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            custom: z.ZodRecord<z.ZodString, z.ZodAny>;
        }>, "strip", z.ZodTypeAny, {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>]>, "many">;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }, {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }>, "many">;
    /** List of registered tool names for this generation if supported by the underlying model. */
    tools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Tool calling mode. `auto` lets the model decide whether to use tools, `required` forces the model to choose a tool, and `none` forces the model not to use any tools. Defaults to `auto`.  */
    toolChoice: z.ZodOptional<z.ZodEnum<["auto", "required", "none"]>>;
    /** Configuration for the generation request. */
    config: z.ZodOptional<z.ZodAny>;
    /** Configuration for the desired output of the request. Defaults to the model's default output if unspecified. */
    output: z.ZodOptional<z.ZodObject<{
        format: z.ZodOptional<z.ZodString>;
        contentType: z.ZodOptional<z.ZodString>;
        instructions: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
        jsonSchema: z.ZodOptional<z.ZodAny>;
        constrained: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        contentType?: string | undefined;
        format?: string | undefined;
        constrained?: boolean | undefined;
        jsonSchema?: any;
        instructions?: string | boolean | undefined;
    }, {
        contentType?: string | undefined;
        format?: string | undefined;
        constrained?: boolean | undefined;
        jsonSchema?: any;
        instructions?: string | boolean | undefined;
    }>>;
    /** Options for resuming an interrupted generation. */
    resume: z.ZodOptional<z.ZodObject<{
        respond: z.ZodOptional<z.ZodArray<z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            toolResponse: z.ZodObject<{
                ref: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                output: z.ZodOptional<z.ZodUnknown>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            }, {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            }>;
        }>, "strip", z.ZodTypeAny, {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, "many">>;
        restart: z.ZodOptional<z.ZodArray<z.ZodObject<z.objectUtil.extendShape<{
            text: z.ZodOptional<z.ZodNever>;
            media: z.ZodOptional<z.ZodNever>;
            toolRequest: z.ZodOptional<z.ZodNever>;
            toolResponse: z.ZodOptional<z.ZodNever>;
            data: z.ZodOptional<z.ZodUnknown>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, {
            toolRequest: z.ZodObject<{
                ref: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                input: z.ZodOptional<z.ZodUnknown>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            }, {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            }>;
        }>, "strip", z.ZodTypeAny, {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }, {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }>, "many">>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        metadata?: Record<string, any> | undefined;
        respond?: {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }[] | undefined;
        restart?: {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }[] | undefined;
    }, {
        metadata?: Record<string, any> | undefined;
        respond?: {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }[] | undefined;
        restart?: {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }[] | undefined;
    }>>;
    /** When true, return tool calls for manual processing instead of automatically resolving them. */
    returnToolRequests: z.ZodOptional<z.ZodBoolean>;
    /** Maximum number of tool call iterations that can be performed in a single generate call (default 5). */
    maxTurns: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    model: string;
    messages: {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }[];
    docs?: {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, any> | undefined;
    }[] | undefined;
    tools?: string[] | undefined;
    toolChoice?: "auto" | "required" | "none" | undefined;
    config?: any;
    output?: {
        contentType?: string | undefined;
        format?: string | undefined;
        constrained?: boolean | undefined;
        jsonSchema?: any;
        instructions?: string | boolean | undefined;
    } | undefined;
    resume?: {
        metadata?: Record<string, any> | undefined;
        respond?: {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }[] | undefined;
        restart?: {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }[] | undefined;
    } | undefined;
    returnToolRequests?: boolean | undefined;
    maxTurns?: number | undefined;
}, {
    model: string;
    messages: {
        role: "model" | "system" | "user" | "tool";
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            custom: Record<string, any>;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, unknown> | undefined;
    }[];
    docs?: {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        })[];
        metadata?: Record<string, any> | undefined;
    }[] | undefined;
    tools?: string[] | undefined;
    toolChoice?: "auto" | "required" | "none" | undefined;
    config?: any;
    output?: {
        contentType?: string | undefined;
        format?: string | undefined;
        constrained?: boolean | undefined;
        jsonSchema?: any;
        instructions?: string | boolean | undefined;
    } | undefined;
    resume?: {
        metadata?: Record<string, any> | undefined;
        respond?: {
            toolResponse: {
                name: string;
                output?: unknown;
                ref?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }[] | undefined;
        restart?: {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
            metadata?: Record<string, unknown> | undefined;
        }[] | undefined;
    } | undefined;
    returnToolRequests?: boolean | undefined;
    maxTurns?: number | undefined;
}>;
type GenerateActionOptions = z.infer<typeof GenerateActionOptionsSchema>;

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

interface ChunkParser<T = unknown> {
    (chunk: GenerateResponseChunk<T>): T;
}
declare class GenerateResponseChunk<T = unknown> implements GenerateResponseChunkData {
    /** The index of the message this chunk corresponds to, starting with `0` for the first model response of the generation. */
    index: number;
    /** The role of the message this chunk corresponds to. Will always be `model` or `tool`. */
    role: Role;
    /** The content generated in this chunk. */
    content: Part[];
    /** Custom model-specific data for this chunk. */
    custom?: unknown;
    /** Accumulated chunks for partial output extraction. */
    previousChunks?: GenerateResponseChunkData[];
    /** The parser to be used to parse `output` from this chunk. */
    parser?: ChunkParser<T>;
    constructor(data: GenerateResponseChunkData, options: {
        previousChunks?: GenerateResponseChunkData[];
        role: Role;
        index: number;
        parser?: ChunkParser<T>;
    });
    /**
     * Concatenates all `text` parts present in the chunk with no delimiter.
     * @returns A string of all concatenated text parts.
     */
    get text(): string;
    /**
     * Concatenates all `text` parts of all chunks from the response thus far.
     * @returns A string of all concatenated chunk text content.
     */
    get accumulatedText(): string;
    /**
     * Concatenates all `text` parts of all preceding chunks.
     */
    get previousText(): string;
    /**
     * Returns the first media part detected in the chunk. Useful for extracting
     * (for example) an image from a generation expected to create one.
     * @returns The first detected `media` part in the chunk.
     */
    get media(): {
        url: string;
        contentType?: string;
    } | null;
    /**
     * Returns the first detected `data` part of a chunk.
     * @returns The first `data` part detected in the chunk (if any).
     */
    get data(): T | null;
    /**
     * Returns all tool request found in this chunk.
     * @returns Array of all tool request found in this chunk.
     */
    get toolRequests(): ToolRequestPart[];
    /**
     * Parses the chunk into the desired output format using the parser associated
     * with the generate request, or falls back to naive JSON parsing otherwise.
     */
    get output(): T | null;
    toJSON(): GenerateResponseChunkData;
}

export { CandidateErrorSchema as $, type AugmentWithContextOptions as A, simulateConstrainedGeneration as B, CONTEXT_PREFACE as C, type GenerateAction as D, defineGenerateAction as E, type Formatter as F, GenerateResponseChunk as G, generateHelper as H, shouldInjectFormatInstructions as I, inferRoleFromParts as J, ModelInfoSchema as K, type ModelInfo as L, Message as M, ToolDefinitionSchema as N, type OutputContentTypes as O, PartSchema as P, GenerationCommonConfigDescriptions as Q, RoleSchema as R, type SimulatedConstrainedGenerationOptions as S, type ToolDefinition as T, type GenerationCommonConfig as U, OutputConfigSchema as V, type OutputConfig as W, GenerationUsageSchema as X, FinishReasonSchema as Y, CandidateSchema as Z, type CandidateData as _, GenerateResponseChunkSchema as a, type CandidateError as a0, ModelResponseChunkSchema as a1, type ModelResponseChunkData as a2, type ModelAction as a3, type DefineModelOptions as a4, defineModel as a5, modelRef as a6, getBasicUsageStats as a7, type ResolvedModel as a8, resolveModel as a9, GenerateActionOutputConfig as aa, GenerateActionOptionsSchema as ab, type ChunkParser as ac, GenerationCommonConfigSchema as b, MessageSchema as c, ModelRequestSchema as d, ModelResponseSchema as e, type GenerateRequest as f, type GenerateRequestData as g, type GenerateResponseChunkData as h, type GenerateResponseData as i, type GenerationUsage as j, type MessageData as k, type ModelArgument as l, type ModelReference as m, type ModelRequest as n, type ModelResponseData as o, type Part as p, type Role as q, type GenerateActionOptions as r, type MessageParser as s, GenerateRequestSchema as t, GenerateResponseSchema as u, type ModelMiddleware as v, downloadRequestMedia as w, validateSupport as x, simulateSystemPrompt as y, augmentWithContext as z };
