import { ModelReference, z, EmbedderReference, Genkit, EmbedderAction } from 'genkit';
import { GenkitPlugin } from 'genkit/plugin';
import { GeminiConfigSchema } from './gemini.js';

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

interface PluginOptions {
    /**
     * Provide the API key to use to authenticate with the Gemini API. By
     * default, an API key must be provided explicitly here or through the
     * `GEMINI_API_KEY` or `GOOGLE_API_KEY` environment variables.
     *
     * If `false` is explicitly passed, the plugin will be configured to
     * expect an `apiKey` option to be provided to the model config at
     * call time.
     **/
    apiKey?: string | false;
    apiVersion?: string | string[];
    baseUrl?: string;
    models?: (ModelReference</** @ignore */ typeof GeminiConfigSchema> | string)[];
    experimental_debugTraces?: boolean;
}
/**
 * Google Gemini Developer API plugin.
 */
declare function googleAI(options?: PluginOptions): GenkitPlugin;

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

declare const TaskTypeSchema: z.ZodEnum<["RETRIEVAL_DOCUMENT", "RETRIEVAL_QUERY", "SEMANTIC_SIMILARITY", "CLASSIFICATION", "CLUSTERING"]>;
type TaskType = z.infer<typeof TaskTypeSchema>;
declare const GeminiEmbeddingConfigSchema: z.ZodObject<{
    /** Override the API key provided at plugin initialization. */
    apiKey: z.ZodOptional<z.ZodString>;
    /**
     * The `task_type` parameter is defined as the intended downstream application to help the model
     * produce better quality embeddings.
     **/
    taskType: z.ZodOptional<z.ZodEnum<["RETRIEVAL_DOCUMENT", "RETRIEVAL_QUERY", "SEMANTIC_SIMILARITY", "CLASSIFICATION", "CLUSTERING"]>>;
    title: z.ZodOptional<z.ZodString>;
    version: z.ZodOptional<z.ZodString>;
    /**
     * The `outputDimensionality` parameter allows you to specify the dimensionality of the embedding output.
     * By default, the model generates embeddings with 768 dimensions. Models such as
     * `text-embedding-004`, `text-embedding-005`, and `text-multilingual-embedding-002`
     * allow the output dimensionality to be adjusted between 1 and 768.
     * By selecting a smaller output dimensionality, users can save memory and storage space, leading to more efficient computations.
     **/
    outputDimensionality: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
    title?: string | undefined;
    version?: string | undefined;
    outputDimensionality?: number | undefined;
}, {
    apiKey?: string | undefined;
    taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
    title?: string | undefined;
    version?: string | undefined;
    outputDimensionality?: number | undefined;
}>;
type GeminiEmbeddingConfig = z.infer<typeof GeminiEmbeddingConfigSchema>;
declare const textEmbeddingGecko001: EmbedderReference<z.ZodObject<{
    /** Override the API key provided at plugin initialization. */
    apiKey: z.ZodOptional<z.ZodString>;
    /**
     * The `task_type` parameter is defined as the intended downstream application to help the model
     * produce better quality embeddings.
     **/
    taskType: z.ZodOptional<z.ZodEnum<["RETRIEVAL_DOCUMENT", "RETRIEVAL_QUERY", "SEMANTIC_SIMILARITY", "CLASSIFICATION", "CLUSTERING"]>>;
    title: z.ZodOptional<z.ZodString>;
    version: z.ZodOptional<z.ZodString>;
    /**
     * The `outputDimensionality` parameter allows you to specify the dimensionality of the embedding output.
     * By default, the model generates embeddings with 768 dimensions. Models such as
     * `text-embedding-004`, `text-embedding-005`, and `text-multilingual-embedding-002`
     * allow the output dimensionality to be adjusted between 1 and 768.
     * By selecting a smaller output dimensionality, users can save memory and storage space, leading to more efficient computations.
     **/
    outputDimensionality: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
    title?: string | undefined;
    version?: string | undefined;
    outputDimensionality?: number | undefined;
}, {
    apiKey?: string | undefined;
    taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
    title?: string | undefined;
    version?: string | undefined;
    outputDimensionality?: number | undefined;
}>>;
declare const textEmbedding004: EmbedderReference<z.ZodObject<{
    /** Override the API key provided at plugin initialization. */
    apiKey: z.ZodOptional<z.ZodString>;
    /**
     * The `task_type` parameter is defined as the intended downstream application to help the model
     * produce better quality embeddings.
     **/
    taskType: z.ZodOptional<z.ZodEnum<["RETRIEVAL_DOCUMENT", "RETRIEVAL_QUERY", "SEMANTIC_SIMILARITY", "CLASSIFICATION", "CLUSTERING"]>>;
    title: z.ZodOptional<z.ZodString>;
    version: z.ZodOptional<z.ZodString>;
    /**
     * The `outputDimensionality` parameter allows you to specify the dimensionality of the embedding output.
     * By default, the model generates embeddings with 768 dimensions. Models such as
     * `text-embedding-004`, `text-embedding-005`, and `text-multilingual-embedding-002`
     * allow the output dimensionality to be adjusted between 1 and 768.
     * By selecting a smaller output dimensionality, users can save memory and storage space, leading to more efficient computations.
     **/
    outputDimensionality: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
    title?: string | undefined;
    version?: string | undefined;
    outputDimensionality?: number | undefined;
}, {
    apiKey?: string | undefined;
    taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
    title?: string | undefined;
    version?: string | undefined;
    outputDimensionality?: number | undefined;
}>>;
declare const SUPPORTED_MODELS: {
    'embedding-001': EmbedderReference<z.ZodObject<{
        /** Override the API key provided at plugin initialization. */
        apiKey: z.ZodOptional<z.ZodString>;
        /**
         * The `task_type` parameter is defined as the intended downstream application to help the model
         * produce better quality embeddings.
         **/
        taskType: z.ZodOptional<z.ZodEnum<["RETRIEVAL_DOCUMENT", "RETRIEVAL_QUERY", "SEMANTIC_SIMILARITY", "CLASSIFICATION", "CLUSTERING"]>>;
        title: z.ZodOptional<z.ZodString>;
        version: z.ZodOptional<z.ZodString>;
        /**
         * The `outputDimensionality` parameter allows you to specify the dimensionality of the embedding output.
         * By default, the model generates embeddings with 768 dimensions. Models such as
         * `text-embedding-004`, `text-embedding-005`, and `text-multilingual-embedding-002`
         * allow the output dimensionality to be adjusted between 1 and 768.
         * By selecting a smaller output dimensionality, users can save memory and storage space, leading to more efficient computations.
         **/
        outputDimensionality: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
        title?: string | undefined;
        version?: string | undefined;
        outputDimensionality?: number | undefined;
    }, {
        apiKey?: string | undefined;
        taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
        title?: string | undefined;
        version?: string | undefined;
        outputDimensionality?: number | undefined;
    }>>;
    'text-embedding-004': EmbedderReference<z.ZodObject<{
        /** Override the API key provided at plugin initialization. */
        apiKey: z.ZodOptional<z.ZodString>;
        /**
         * The `task_type` parameter is defined as the intended downstream application to help the model
         * produce better quality embeddings.
         **/
        taskType: z.ZodOptional<z.ZodEnum<["RETRIEVAL_DOCUMENT", "RETRIEVAL_QUERY", "SEMANTIC_SIMILARITY", "CLASSIFICATION", "CLUSTERING"]>>;
        title: z.ZodOptional<z.ZodString>;
        version: z.ZodOptional<z.ZodString>;
        /**
         * The `outputDimensionality` parameter allows you to specify the dimensionality of the embedding output.
         * By default, the model generates embeddings with 768 dimensions. Models such as
         * `text-embedding-004`, `text-embedding-005`, and `text-multilingual-embedding-002`
         * allow the output dimensionality to be adjusted between 1 and 768.
         * By selecting a smaller output dimensionality, users can save memory and storage space, leading to more efficient computations.
         **/
        outputDimensionality: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
        title?: string | undefined;
        version?: string | undefined;
        outputDimensionality?: number | undefined;
    }, {
        apiKey?: string | undefined;
        taskType?: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | undefined;
        title?: string | undefined;
        version?: string | undefined;
        outputDimensionality?: number | undefined;
    }>>;
};
declare function defineGoogleAIEmbedder(ai: Genkit, name: string, pluginOptions: PluginOptions): EmbedderAction<any>;

export { GeminiEmbeddingConfigSchema as G, type PluginOptions as P, SUPPORTED_MODELS as S, TaskTypeSchema as T, textEmbeddingGecko001 as a, type TaskType as b, type GeminiEmbeddingConfig as c, defineGoogleAIEmbedder as d, googleAI as g, textEmbedding004 as t };
