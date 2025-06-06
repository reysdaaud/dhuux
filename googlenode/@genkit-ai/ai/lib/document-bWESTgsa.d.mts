import { z, Action } from '@genkit-ai/core';
import { Registry } from '@genkit-ai/core/registry';

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
 * A batch (array) of embeddings.
 */
type EmbeddingBatch = {
    embedding: number[];
}[];
/**
 * EmbeddingSchema includes the embedding and also metadata so you know
 * which of multiple embeddings corresponds to which part of a document.
 */
declare const EmbeddingSchema: z.ZodObject<{
    embedding: z.ZodArray<z.ZodNumber, "many">;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    embedding: number[];
    metadata?: Record<string, unknown> | undefined;
}, {
    embedding: number[];
    metadata?: Record<string, unknown> | undefined;
}>;
type Embedding = z.infer<typeof EmbeddingSchema>;
/**
 * A function used for embedder definition, encapsulates embedder implementation.
 */
type EmbedderFn<EmbedderOptions extends z.ZodTypeAny> = (input: Document[], embedderOpts?: z.infer<EmbedderOptions>) => Promise<EmbedResponse>;
/**
 * Zod schema of an embed request.
 */
declare const EmbedRequestSchema: z.ZodObject<{
    input: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    options: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    input: {
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
    }[];
    options?: any;
}, {
    input: {
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
    }[];
    options?: any;
}>;
/**
 * Zod schema of an embed response.
 */
declare const EmbedResponseSchema: z.ZodObject<{
    embeddings: z.ZodArray<z.ZodObject<{
        embedding: z.ZodArray<z.ZodNumber, "many">;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        embedding: number[];
        metadata?: Record<string, unknown> | undefined;
    }, {
        embedding: number[];
        metadata?: Record<string, unknown> | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    embeddings: {
        embedding: number[];
        metadata?: Record<string, unknown> | undefined;
    }[];
}, {
    embeddings: {
        embedding: number[];
        metadata?: Record<string, unknown> | undefined;
    }[];
}>;
type EmbedResponse = z.infer<typeof EmbedResponseSchema>;
/**
 * Embedder action -- a subtype of {@link Action} with input/output types for embedders.
 */
type EmbedderAction<CustomOptions extends z.ZodTypeAny = z.ZodTypeAny> = Action<typeof EmbedRequestSchema, typeof EmbedResponseSchema> & {
    __configSchema?: CustomOptions;
};
/**
 * Options of an `embed` function.
 */
interface EmbedderParams<CustomOptions extends z.ZodTypeAny = z.ZodTypeAny> {
    embedder: EmbedderArgument<CustomOptions>;
    content: string | DocumentData;
    metadata?: Record<string, unknown>;
    options?: z.infer<CustomOptions>;
}
/**
 * Creates embedder model for the provided {@link EmbedderFn} model implementation.
 */
declare function defineEmbedder<ConfigSchema extends z.ZodTypeAny = z.ZodTypeAny>(registry: Registry, options: {
    name: string;
    configSchema?: ConfigSchema;
    info?: EmbedderInfo;
}, runner: EmbedderFn<ConfigSchema>): EmbedderAction<ConfigSchema>;
/**
 * A union type representing all the types that can refer to an embedder.
 */
type EmbedderArgument<CustomOptions extends z.ZodTypeAny = z.ZodTypeAny> = string | EmbedderAction<CustomOptions> | EmbedderReference<CustomOptions>;
/**
 * A veneer for interacting with embedder models.
 */
declare function embed<CustomOptions extends z.ZodTypeAny = z.ZodTypeAny>(registry: Registry, params: EmbedderParams<CustomOptions>): Promise<Embedding[]>;
/**
 * A veneer for interacting with embedder models in bulk.
 */
declare function embedMany<ConfigSchema extends z.ZodTypeAny = z.ZodTypeAny>(registry: Registry, params: {
    embedder: EmbedderArgument<ConfigSchema>;
    content: string[] | DocumentData[];
    metadata?: Record<string, unknown>;
    options?: z.infer<ConfigSchema>;
}): Promise<EmbeddingBatch>;
/**
 * Zod schema of embedder info object.
 */
declare const EmbedderInfoSchema: z.ZodObject<{
    /** Friendly label for this model (e.g. "Google AI - Gemini Pro") */
    label: z.ZodOptional<z.ZodString>;
    /** Supported model capabilities. */
    supports: z.ZodOptional<z.ZodObject<{
        /** Model can input this type of data. */
        input: z.ZodOptional<z.ZodArray<z.ZodEnum<["text", "image", "video"]>, "many">>;
        /** Model can support multiple languages */
        multilingual: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        input?: ("text" | "image" | "video")[] | undefined;
        multilingual?: boolean | undefined;
    }, {
        input?: ("text" | "image" | "video")[] | undefined;
        multilingual?: boolean | undefined;
    }>>;
    /** Embedding dimension */
    dimensions: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    label?: string | undefined;
    supports?: {
        input?: ("text" | "image" | "video")[] | undefined;
        multilingual?: boolean | undefined;
    } | undefined;
    dimensions?: number | undefined;
}, {
    label?: string | undefined;
    supports?: {
        input?: ("text" | "image" | "video")[] | undefined;
        multilingual?: boolean | undefined;
    } | undefined;
    dimensions?: number | undefined;
}>;
type EmbedderInfo = z.infer<typeof EmbedderInfoSchema>;
/**
 * A reference object that can used to resolve an embedder instance. Include additional type information
 * about the specific embedder, e.g. custom config options schema.
 */
interface EmbedderReference<CustomOptions extends z.ZodTypeAny = z.ZodTypeAny> {
    name: string;
    configSchema?: CustomOptions;
    info?: EmbedderInfo;
    config?: z.infer<CustomOptions>;
    version?: string;
}
/**
 * Helper method to configure a {@link EmbedderReference} to a plugin.
 */
declare function embedderRef<CustomOptionsSchema extends z.ZodTypeAny = z.ZodTypeAny>(options: EmbedderReference<CustomOptionsSchema>): EmbedderReference<CustomOptionsSchema>;

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
 * Zod schema for a text part.
 */
declare const TextPartSchema: z.ZodObject<z.objectUtil.extendShape<{
    text: z.ZodOptional<z.ZodNever>;
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, {
    /** The text of the message. */
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
}>;
/**
 * Text part.
 */
type TextPart = z.infer<typeof TextPartSchema>;
/**
 * Zod schema of media.
 */
declare const MediaSchema: z.ZodObject<{
    /** The media content type. Inferred from data uri if not provided. */
    contentType: z.ZodOptional<z.ZodString>;
    /** A `data:` or `https:` uri containing the media content.  */
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    url: string;
    contentType?: string | undefined;
}, {
    url: string;
    contentType?: string | undefined;
}>;
/**
 * Zod schema of a media part.
 */
declare const MediaPartSchema: z.ZodObject<z.objectUtil.extendShape<{
    text: z.ZodOptional<z.ZodNever>;
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, {
    media: z.ZodObject<{
        /** The media content type. Inferred from data uri if not provided. */
        contentType: z.ZodOptional<z.ZodString>;
        /** A `data:` or `https:` uri containing the media content.  */
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
}>;
/**
 * Media part.
 */
type MediaPart = z.infer<typeof MediaPartSchema>;
/**
 * Zod schema of a tool request.
 */
declare const ToolRequestSchema: z.ZodObject<{
    /** The call id or reference for a specific request. */
    ref: z.ZodOptional<z.ZodString>;
    /** The name of the tool to call. */
    name: z.ZodString;
    /** The input parameters for the tool, usually a JSON object. */
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
type ToolRequest = z.infer<typeof ToolRequestSchema>;
/**
 * Zod schema of a tool request part.
 */
declare const ToolRequestPartSchema: z.ZodObject<z.objectUtil.extendShape<{
    text: z.ZodOptional<z.ZodNever>;
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, {
    /** A request for a tool to be executed, usually provided by a model. */
    toolRequest: z.ZodObject<{
        /** The call id or reference for a specific request. */
        ref: z.ZodOptional<z.ZodString>;
        /** The name of the tool to call. */
        name: z.ZodString;
        /** The input parameters for the tool, usually a JSON object. */
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
}>;
/**
 * Tool part.
 */
type ToolRequestPart = z.infer<typeof ToolRequestPartSchema>;
/**
 * Zod schema of a tool response.
 */
declare const ToolResponseSchema: z.ZodObject<{
    /** The call id or reference for a specific request. */
    ref: z.ZodOptional<z.ZodString>;
    /** The name of the tool. */
    name: z.ZodString;
    /** The output data returned from the tool, usually a JSON object. */
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
type ToolResponse = z.infer<typeof ToolResponseSchema>;
/**
 * Zod schema of a tool response part.
 */
declare const ToolResponsePartSchema: z.ZodObject<z.objectUtil.extendShape<{
    text: z.ZodOptional<z.ZodNever>;
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, {
    /** A provided response to a tool call. */
    toolResponse: z.ZodObject<{
        /** The call id or reference for a specific request. */
        ref: z.ZodOptional<z.ZodString>;
        /** The name of the tool. */
        name: z.ZodString;
        /** The output data returned from the tool, usually a JSON object. */
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
}>;
/**
 * Tool response part.
 */
type ToolResponsePart = z.infer<typeof ToolResponsePartSchema>;
/**
 * Zod schema of a data part.
 */
declare const DataPartSchema: z.ZodObject<z.objectUtil.extendShape<{
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
}>;
/**
 * Data part.
 */
type DataPart = z.infer<typeof DataPartSchema>;
/**
 * Zod schema of a custom part.
 */
declare const CustomPartSchema: z.ZodObject<z.objectUtil.extendShape<{
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
}>;
/**
 * Custom part.
 */
type CustomPart = z.infer<typeof CustomPartSchema>;
declare const PartSchema: z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
    text: z.ZodOptional<z.ZodNever>;
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, {
    /** The text of the message. */
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
        /** The media content type. Inferred from data uri if not provided. */
        contentType: z.ZodOptional<z.ZodString>;
        /** A `data:` or `https:` uri containing the media content.  */
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
}>]>;
type Part = z.infer<typeof PartSchema>;
declare const DocumentDataSchema: z.ZodObject<{
    content: z.ZodArray<z.ZodUnion<[z.ZodObject<z.objectUtil.extendShape<{
        text: z.ZodOptional<z.ZodNever>;
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, {
        /** The text of the message. */
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
            /** The media content type. Inferred from data uri if not provided. */
            contentType: z.ZodOptional<z.ZodString>;
            /** A `data:` or `https:` uri containing the media content.  */
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
}>;
type DocumentData = z.infer<typeof DocumentDataSchema>;
/**
 * Document represents document content along with its metadata that can be embedded, indexed or
 * retrieved. Each document can contain multiple parts (for example text and an image)
 */
declare class Document implements DocumentData {
    content: Part[];
    metadata?: Record<string, any>;
    constructor(data: DocumentData);
    static fromText(text: string, metadata?: Record<string, any>): Document;
    static fromMedia(url: string, contentType?: string, metadata?: Record<string, unknown>): Document;
    static fromData(data: string, dataType?: string, metadata?: Record<string, unknown>): Document;
    /**
     * Concatenates all `text` parts present in the document with no delimiter.
     * @returns A string of all concatenated text parts.
     */
    get text(): string;
    /**
     * Media array getter.
     * @returns the array of media parts.
     */
    get media(): {
        url: string;
        contentType?: string;
    }[];
    /**
     * Gets the first item in the document. Either text or media url.
     */
    get data(): string;
    /**
     * Gets the contentType of the data that is returned by data()
     */
    get dataType(): string | undefined;
    toJSON(): DocumentData;
    /**
     * Embedders may return multiple embeddings for a single document.
     * But storage still requires a 1:1 relationship. So we create an
     * array of Documents from a single document - one per embedding.
     * @param embeddings The embeddings to create the documents from.
     * @returns an array of documents based on this document and the embeddings.
     */
    getEmbeddingDocuments(embeddings: Embedding[]): Document[];
}
declare function checkUniqueDocuments(documents: Document[]): boolean;

export { MediaSchema as A, ToolRequestSchema as B, CustomPartSchema as C, Document as D, type EmbedderAction as E, ToolResponseSchema as F, PartSchema as G, checkUniqueDocuments as H, type MediaPart as M, type Part as P, type ToolRequest as T, DocumentDataSchema as a, type DocumentData as b, type ToolResponse as c, embedderRef as d, embed as e, type EmbedderArgument as f, type EmbedderInfo as g, type EmbedderParams as h, type EmbedderReference as i, type Embedding as j, type ToolRequestPart as k, type ToolResponsePart as l, type TextPart as m, DataPartSchema as n, MediaPartSchema as o, TextPartSchema as p, ToolRequestPartSchema as q, ToolResponsePartSchema as r, type CustomPart as s, type DataPart as t, type EmbeddingBatch as u, EmbeddingSchema as v, type EmbedderFn as w, defineEmbedder as x, embedMany as y, EmbedderInfoSchema as z };
