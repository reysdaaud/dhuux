import { FunctionDeclaration, Content, GenerateContentCandidate } from '@google/generative-ai';
import { z, JSONSchema, Genkit } from 'genkit';
import { ModelReference, ToolDefinitionSchema, MessageData, CandidateData, ModelInfo, ModelAction } from 'genkit/model';

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

declare const GeminiConfigSchema: z.ZodObject<z.objectUtil.extendShape<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, {
    apiKey: z.ZodOptional<z.ZodString>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
    contextCache: z.ZodOptional<z.ZodBoolean>;
    functionCallingConfig: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
        allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }>>;
    responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
}>, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}>;
type GeminiConfig = z.infer<typeof GeminiConfigSchema>;
declare const gemini10Pro: ModelReference<z.ZodObject<z.objectUtil.extendShape<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, {
    apiKey: z.ZodOptional<z.ZodString>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
    contextCache: z.ZodOptional<z.ZodBoolean>;
    functionCallingConfig: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
        allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }>>;
    responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
}>, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}>>;
declare const gemini15Pro: ModelReference<z.ZodObject<z.objectUtil.extendShape<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, {
    apiKey: z.ZodOptional<z.ZodString>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
    contextCache: z.ZodOptional<z.ZodBoolean>;
    functionCallingConfig: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
        allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }>>;
    responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
}>, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}>>;
declare const gemini15Flash: ModelReference<z.ZodObject<z.objectUtil.extendShape<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, {
    apiKey: z.ZodOptional<z.ZodString>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
    contextCache: z.ZodOptional<z.ZodBoolean>;
    functionCallingConfig: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
        allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }>>;
    responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
}>, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}>>;
declare const gemini15Flash8b: ModelReference<z.ZodObject<z.objectUtil.extendShape<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, {
    apiKey: z.ZodOptional<z.ZodString>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
    contextCache: z.ZodOptional<z.ZodBoolean>;
    functionCallingConfig: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
        allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }>>;
    responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
}>, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}>>;
declare const gemini20Flash: ModelReference<z.ZodObject<z.objectUtil.extendShape<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, {
    apiKey: z.ZodOptional<z.ZodString>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
    contextCache: z.ZodOptional<z.ZodBoolean>;
    functionCallingConfig: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
        allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }>>;
    responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
}>, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}>>;
declare const gemini20FlashExp: ModelReference<z.ZodObject<z.objectUtil.extendShape<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, {
    apiKey: z.ZodOptional<z.ZodString>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
    contextCache: z.ZodOptional<z.ZodBoolean>;
    functionCallingConfig: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
        allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }>>;
    responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
}>, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}>>;
declare const gemini20FlashLite: ModelReference<z.ZodObject<z.objectUtil.extendShape<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, {
    apiKey: z.ZodOptional<z.ZodString>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
    contextCache: z.ZodOptional<z.ZodBoolean>;
    functionCallingConfig: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
        allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }>>;
    responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
}>, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}>>;
declare const gemini20ProExp0205: ModelReference<z.ZodObject<z.objectUtil.extendShape<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, {
    apiKey: z.ZodOptional<z.ZodString>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
    contextCache: z.ZodOptional<z.ZodBoolean>;
    functionCallingConfig: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
        allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }>>;
    responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
}>, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}>>;
declare const gemini25FlashPreview0417: ModelReference<z.ZodObject<z.objectUtil.extendShape<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, {
    apiKey: z.ZodOptional<z.ZodString>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
    contextCache: z.ZodOptional<z.ZodBoolean>;
    functionCallingConfig: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
        allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }>>;
    responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
}>, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}>>;
declare const gemini25ProExp0325: ModelReference<z.ZodObject<z.objectUtil.extendShape<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, {
    apiKey: z.ZodOptional<z.ZodString>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
    contextCache: z.ZodOptional<z.ZodBoolean>;
    functionCallingConfig: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
        allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }>>;
    responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
}>, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}>>;
declare const gemini25ProPreview0325: ModelReference<z.ZodObject<z.objectUtil.extendShape<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, {
    apiKey: z.ZodOptional<z.ZodString>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
    contextCache: z.ZodOptional<z.ZodBoolean>;
    functionCallingConfig: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
        allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }>>;
    responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
}>, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}>>;
declare const SUPPORTED_V1_MODELS: {
    'gemini-1.0-pro': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
};
declare const SUPPORTED_V15_MODELS: {
    'gemini-1.5-pro': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    'gemini-1.5-flash': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    'gemini-1.5-flash-8b': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    'gemini-2.0-flash': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    'gemini-2.0-flash-lite': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    'gemini-2.0-pro-exp-02-05': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    'gemini-2.0-flash-exp': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    'gemini-2.5-pro-exp-03-25': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    'gemini-2.5-pro-preview-03-25': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    'gemini-2.5-flash-preview-04-17': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
};
declare const GENERIC_GEMINI_MODEL: ModelReference<z.ZodObject<z.objectUtil.extendShape<{
    version: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxOutputTokens: z.ZodOptional<z.ZodNumber>;
    topK: z.ZodOptional<z.ZodNumber>;
    topP: z.ZodOptional<z.ZodNumber>;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, {
    apiKey: z.ZodOptional<z.ZodString>;
    safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
        threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
    }, "strip", z.ZodTypeAny, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }, {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }>, "many">>;
    codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
    contextCache: z.ZodOptional<z.ZodBoolean>;
    functionCallingConfig: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
        allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }, {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    }>>;
    responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
}>, "strip", z.ZodTypeAny, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}, {
    apiKey?: string | undefined;
    version?: string | undefined;
    safetySettings?: {
        category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
        threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
    }[] | undefined;
    codeExecution?: boolean | {} | undefined;
    contextCache?: boolean | undefined;
    functionCallingConfig?: {
        mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
        allowedFunctionNames?: string[] | undefined;
    } | undefined;
    responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
    temperature?: number | undefined;
    maxOutputTokens?: number | undefined;
    topK?: number | undefined;
    topP?: number | undefined;
    stopSequences?: string[] | undefined;
}>>;
declare const SUPPORTED_GEMINI_MODELS: {
    readonly 'gemini-1.5-pro': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    readonly 'gemini-1.5-flash': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    readonly 'gemini-1.5-flash-8b': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    readonly 'gemini-2.0-flash': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    readonly 'gemini-2.0-flash-lite': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    readonly 'gemini-2.0-pro-exp-02-05': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    readonly 'gemini-2.0-flash-exp': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    readonly 'gemini-2.5-pro-exp-03-25': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    readonly 'gemini-2.5-pro-preview-03-25': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    readonly 'gemini-2.5-flash-preview-04-17': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
    readonly 'gemini-1.0-pro': ModelReference<z.ZodObject<z.objectUtil.extendShape<{
        version: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxOutputTokens: z.ZodOptional<z.ZodNumber>;
        topK: z.ZodOptional<z.ZodNumber>;
        topP: z.ZodOptional<z.ZodNumber>;
        stopSequences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, {
        apiKey: z.ZodOptional<z.ZodString>;
        safetySettings: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["HARM_CATEGORY_UNSPECIFIED", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_DANGEROUS_CONTENT", "HARM_CATEGORY_CIVIC_INTEGRITY"]>;
            threshold: z.ZodEnum<["BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE"]>;
        }, "strip", z.ZodTypeAny, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }, {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }>, "many">>;
        codeExecution: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>]>>;
        contextCache: z.ZodOptional<z.ZodBoolean>;
        functionCallingConfig: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]>>;
            allowedFunctionNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }, {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        }>>;
        responseModalities: z.ZodOptional<z.ZodArray<z.ZodEnum<["TEXT", "IMAGE", "AUDIO"]>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }, {
        apiKey?: string | undefined;
        version?: string | undefined;
        safetySettings?: {
            category: "HARM_CATEGORY_UNSPECIFIED" | "HARM_CATEGORY_HATE_SPEECH" | "HARM_CATEGORY_SEXUALLY_EXPLICIT" | "HARM_CATEGORY_HARASSMENT" | "HARM_CATEGORY_DANGEROUS_CONTENT" | "HARM_CATEGORY_CIVIC_INTEGRITY";
            threshold: "BLOCK_LOW_AND_ABOVE" | "BLOCK_MEDIUM_AND_ABOVE" | "BLOCK_ONLY_HIGH" | "BLOCK_NONE";
        }[] | undefined;
        codeExecution?: boolean | {} | undefined;
        contextCache?: boolean | undefined;
        functionCallingConfig?: {
            mode?: "MODE_UNSPECIFIED" | "AUTO" | "ANY" | "NONE" | undefined;
            allowedFunctionNames?: string[] | undefined;
        } | undefined;
        responseModalities?: ("TEXT" | "IMAGE" | "AUDIO")[] | undefined;
        temperature?: number | undefined;
        maxOutputTokens?: number | undefined;
        topK?: number | undefined;
        topP?: number | undefined;
        stopSequences?: string[] | undefined;
    }>>;
};
/**
 * Known model names, to allow code completion for convenience. Allows other model names.
 */
type GeminiVersionString = keyof typeof SUPPORTED_GEMINI_MODELS | (string & {});
/**
 * Returns a reference to a model that can be used in generate calls.
 *
 * ```js
 * await ai.generate({
 *   prompt: 'hi',
 *   model: gemini('gemini-1.5-flash')
 * });
 * ```
 */
declare function gemini(version: GeminiVersionString, options?: GeminiConfig): ModelReference<typeof GeminiConfigSchema>;
/** @hidden */
declare function toGeminiTool(tool: z.infer<typeof ToolDefinitionSchema>): FunctionDeclaration;
declare function toGeminiMessage(message: MessageData, model?: ModelReference<z.ZodTypeAny>): Content;
declare function toGeminiSystemInstruction(message: MessageData): Content;
declare function fromGeminiCandidate(candidate: GenerateContentCandidate, jsonMode?: boolean): CandidateData;
declare function cleanSchema(schema: JSONSchema): JSONSchema;
/**
 * Defines a new GoogleAI model.
 */
declare function defineGoogleAIModel({ ai, name, apiKey: apiKeyOption, apiVersion, baseUrl, info, defaultConfig, debugTraces, }: {
    ai: Genkit;
    name: string;
    apiKey?: string | false;
    apiVersion?: string;
    baseUrl?: string;
    info?: ModelInfo;
    defaultConfig?: GeminiConfig;
    debugTraces?: boolean;
}): ModelAction;

export { GENERIC_GEMINI_MODEL, type GeminiConfig, GeminiConfigSchema, type GeminiVersionString, SUPPORTED_GEMINI_MODELS, SUPPORTED_V15_MODELS, SUPPORTED_V1_MODELS, cleanSchema, defineGoogleAIModel, fromGeminiCandidate, gemini, gemini10Pro, gemini15Flash, gemini15Flash8b, gemini15Pro, gemini20Flash, gemini20FlashExp, gemini20FlashLite, gemini20ProExp0205, gemini25FlashPreview0417, gemini25ProExp0325, gemini25ProPreview0325, toGeminiMessage, toGeminiSystemInstruction, toGeminiTool };
