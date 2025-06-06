import { JSONSchema7 } from 'json-schema';
import { z } from 'zod';
import { CreateDatasetRequest, ListEvalKeysRequest, ListEvalKeysResponse, UpdateDatasetRequest } from './apis';
export declare const ModelInferenceInputSchema: z.ZodUnion<[z.ZodString, z.ZodObject<z.objectUtil.extendShape<{
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
            metadata?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        }, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
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
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        }, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
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
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        }, {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
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
                ref?: string | undefined;
                output?: unknown;
            }, {
                name: string;
                ref?: string | undefined;
                output?: unknown;
            }>;
        }>, "strip", z.ZodTypeAny, {
            toolResponse: {
                name: string;
                ref?: string | undefined;
                output?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
        }, {
            toolResponse: {
                name: string;
                ref?: string | undefined;
                output?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
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
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        }, {
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
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
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        }, {
            custom: Record<string, any>;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        }>]>, "many">;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            toolResponse: {
                name: string;
                ref?: string | undefined;
                output?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
        } | {
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            custom: Record<string, any>;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        })[];
        role: "system" | "user" | "model" | "tool";
        metadata?: Record<string, unknown> | undefined;
    }, {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            toolResponse: {
                name: string;
                ref?: string | undefined;
                output?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
        } | {
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            custom: Record<string, any>;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        })[];
        role: "system" | "user" | "model" | "tool";
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
        description: string;
        name: string;
        inputSchema?: Record<string, any> | null | undefined;
        outputSchema?: Record<string, any> | null | undefined;
        metadata?: Record<string, any> | undefined;
    }, {
        description: string;
        name: string;
        inputSchema?: Record<string, any> | null | undefined;
        outputSchema?: Record<string, any> | null | undefined;
        metadata?: Record<string, any> | undefined;
    }>, "many">>;
    toolChoice: z.ZodOptional<z.ZodEnum<["auto", "required", "none"]>>;
    output: z.ZodOptional<z.ZodObject<{
        format: z.ZodOptional<z.ZodString>;
        schema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        constrained: z.ZodOptional<z.ZodBoolean>;
        contentType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        format?: string | undefined;
        schema?: Record<string, any> | undefined;
        contentType?: string | undefined;
        constrained?: boolean | undefined;
    }, {
        format?: string | undefined;
        schema?: Record<string, any> | undefined;
        contentType?: string | undefined;
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
            metadata?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        }, {
            text: string;
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
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
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        }, {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        }>]>, "many">;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        })[];
        metadata?: Record<string, any> | undefined;
    }, {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        })[];
        metadata?: Record<string, any> | undefined;
    }>, "many">>;
}, {
    candidates: z.ZodOptional<z.ZodNumber>;
}>, "strip", z.ZodTypeAny, {
    messages: {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            toolResponse: {
                name: string;
                ref?: string | undefined;
                output?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
        } | {
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            custom: Record<string, any>;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        })[];
        role: "system" | "user" | "model" | "tool";
        metadata?: Record<string, unknown> | undefined;
    }[];
    output?: {
        format?: string | undefined;
        schema?: Record<string, any> | undefined;
        contentType?: string | undefined;
        constrained?: boolean | undefined;
    } | undefined;
    tools?: {
        description: string;
        name: string;
        inputSchema?: Record<string, any> | null | undefined;
        outputSchema?: Record<string, any> | null | undefined;
        metadata?: Record<string, any> | undefined;
    }[] | undefined;
    toolChoice?: "required" | "none" | "auto" | undefined;
    config?: any;
    docs?: {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        })[];
        metadata?: Record<string, any> | undefined;
    }[] | undefined;
    candidates?: number | undefined;
}, {
    messages: {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            toolRequest: {
                name: string;
                ref?: string | undefined;
                input?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            toolResponse: {
                name: string;
                ref?: string | undefined;
                output?: unknown;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            data?: unknown;
        } | {
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            custom: Record<string, any>;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        })[];
        role: "system" | "user" | "model" | "tool";
        metadata?: Record<string, unknown> | undefined;
    }[];
    output?: {
        format?: string | undefined;
        schema?: Record<string, any> | undefined;
        contentType?: string | undefined;
        constrained?: boolean | undefined;
    } | undefined;
    tools?: {
        description: string;
        name: string;
        inputSchema?: Record<string, any> | null | undefined;
        outputSchema?: Record<string, any> | null | undefined;
        metadata?: Record<string, any> | undefined;
    }[] | undefined;
    toolChoice?: "required" | "none" | "auto" | undefined;
    config?: any;
    docs?: {
        content: ({
            text: string;
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            media?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        } | {
            media: {
                url: string;
                contentType?: string | undefined;
            };
            custom?: Record<string, unknown> | undefined;
            metadata?: Record<string, unknown> | undefined;
            text?: undefined;
            toolRequest?: undefined;
            toolResponse?: undefined;
            data?: unknown;
        })[];
        metadata?: Record<string, any> | undefined;
    }[] | undefined;
    candidates?: number | undefined;
}>]>;
export type ModelInferenceInput = z.infer<typeof ModelInferenceInputSchema>;
export declare const ModelInferenceInputJSONSchema: JSONSchema7;
export declare const GenerateRequestJSONSchema: JSONSchema7;
export declare const InferenceSampleSchema: z.ZodObject<{
    testCaseId: z.ZodOptional<z.ZodString>;
    input: z.ZodAny;
    reference: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    input?: any;
    testCaseId?: string | undefined;
    reference?: any;
}, {
    input?: any;
    testCaseId?: string | undefined;
    reference?: any;
}>;
export type InferenceSample = z.infer<typeof InferenceSampleSchema>;
export declare const InferenceDatasetSchema: z.ZodArray<z.ZodObject<{
    testCaseId: z.ZodOptional<z.ZodString>;
    input: z.ZodAny;
    reference: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    input?: any;
    testCaseId?: string | undefined;
    reference?: any;
}, {
    input?: any;
    testCaseId?: string | undefined;
    reference?: any;
}>, "many">;
export type InferenceDataset = z.infer<typeof InferenceDatasetSchema>;
export declare const DatasetSchema: z.ZodArray<z.ZodObject<{
    testCaseId: z.ZodString;
    input: z.ZodAny;
    reference: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    testCaseId: string;
    input?: any;
    reference?: any;
}, {
    testCaseId: string;
    input?: any;
    reference?: any;
}>, "many">;
export type Dataset = z.infer<typeof DatasetSchema>;
export declare const EvaluationSampleSchema: z.ZodObject<{
    testCaseId: z.ZodOptional<z.ZodString>;
    input: z.ZodAny;
    output: z.ZodAny;
    error: z.ZodOptional<z.ZodString>;
    context: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    reference: z.ZodOptional<z.ZodAny>;
    traceIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    input?: any;
    output?: any;
    context?: any[] | undefined;
    testCaseId?: string | undefined;
    reference?: any;
    error?: string | undefined;
    traceIds?: string[] | undefined;
}, {
    input?: any;
    output?: any;
    context?: any[] | undefined;
    testCaseId?: string | undefined;
    reference?: any;
    error?: string | undefined;
    traceIds?: string[] | undefined;
}>;
export type EvaluationSample = z.infer<typeof EvaluationSampleSchema>;
export declare const EvaluationDatasetSchema: z.ZodArray<z.ZodObject<{
    testCaseId: z.ZodOptional<z.ZodString>;
    input: z.ZodAny;
    output: z.ZodAny;
    error: z.ZodOptional<z.ZodString>;
    context: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    reference: z.ZodOptional<z.ZodAny>;
    traceIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    input?: any;
    output?: any;
    context?: any[] | undefined;
    testCaseId?: string | undefined;
    reference?: any;
    error?: string | undefined;
    traceIds?: string[] | undefined;
}, {
    input?: any;
    output?: any;
    context?: any[] | undefined;
    testCaseId?: string | undefined;
    reference?: any;
    error?: string | undefined;
    traceIds?: string[] | undefined;
}>, "many">;
export type EvaluationDataset = z.infer<typeof EvaluationDatasetSchema>;
export declare const EvalInputSchema: z.ZodObject<{
    testCaseId: z.ZodString;
    input: z.ZodAny;
    output: z.ZodAny;
    error: z.ZodOptional<z.ZodString>;
    context: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    reference: z.ZodOptional<z.ZodAny>;
    traceIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    testCaseId: string;
    traceIds: string[];
    input?: any;
    output?: any;
    context?: any[] | undefined;
    reference?: any;
    error?: string | undefined;
}, {
    testCaseId: string;
    traceIds: string[];
    input?: any;
    output?: any;
    context?: any[] | undefined;
    reference?: any;
    error?: string | undefined;
}>;
export type EvalInput = z.infer<typeof EvalInputSchema>;
export declare const EvalInputDatasetSchema: z.ZodArray<z.ZodObject<{
    testCaseId: z.ZodString;
    input: z.ZodAny;
    output: z.ZodAny;
    error: z.ZodOptional<z.ZodString>;
    context: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    reference: z.ZodOptional<z.ZodAny>;
    traceIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    testCaseId: string;
    traceIds: string[];
    input?: any;
    output?: any;
    context?: any[] | undefined;
    reference?: any;
    error?: string | undefined;
}, {
    testCaseId: string;
    traceIds: string[];
    input?: any;
    output?: any;
    context?: any[] | undefined;
    reference?: any;
    error?: string | undefined;
}>, "many">;
export type EvalInputDataset = z.infer<typeof EvalInputDatasetSchema>;
export declare const EvalMetricSchema: z.ZodObject<{
    evaluator: z.ZodString;
    scoreId: z.ZodOptional<z.ZodString>;
    score: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>>;
    status: z.ZodOptional<z.ZodEnum<["UNKNOWN", "PASS", "FAIL"]>>;
    rationale: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
    traceId: z.ZodOptional<z.ZodString>;
    spanId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    evaluator: string;
    status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
    traceId?: string | undefined;
    error?: string | undefined;
    scoreId?: string | undefined;
    score?: string | number | boolean | undefined;
    rationale?: string | undefined;
    spanId?: string | undefined;
}, {
    evaluator: string;
    status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
    traceId?: string | undefined;
    error?: string | undefined;
    scoreId?: string | undefined;
    score?: string | number | boolean | undefined;
    rationale?: string | undefined;
    spanId?: string | undefined;
}>;
export type EvalMetric = z.infer<typeof EvalMetricSchema>;
export declare const EvalResultSchema: z.ZodObject<z.objectUtil.extendShape<{
    testCaseId: z.ZodString;
    input: z.ZodAny;
    output: z.ZodAny;
    error: z.ZodOptional<z.ZodString>;
    context: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    reference: z.ZodOptional<z.ZodAny>;
    traceIds: z.ZodArray<z.ZodString, "many">;
}, {
    metrics: z.ZodOptional<z.ZodArray<z.ZodObject<{
        evaluator: z.ZodString;
        scoreId: z.ZodOptional<z.ZodString>;
        score: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>>;
        status: z.ZodOptional<z.ZodEnum<["UNKNOWN", "PASS", "FAIL"]>>;
        rationale: z.ZodOptional<z.ZodString>;
        error: z.ZodOptional<z.ZodString>;
        traceId: z.ZodOptional<z.ZodString>;
        spanId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        evaluator: string;
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        traceId?: string | undefined;
        error?: string | undefined;
        scoreId?: string | undefined;
        score?: string | number | boolean | undefined;
        rationale?: string | undefined;
        spanId?: string | undefined;
    }, {
        evaluator: string;
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        traceId?: string | undefined;
        error?: string | undefined;
        scoreId?: string | undefined;
        score?: string | number | boolean | undefined;
        rationale?: string | undefined;
        spanId?: string | undefined;
    }>, "many">>;
}>, "strip", z.ZodTypeAny, {
    testCaseId: string;
    traceIds: string[];
    input?: any;
    output?: any;
    context?: any[] | undefined;
    reference?: any;
    error?: string | undefined;
    metrics?: {
        evaluator: string;
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        traceId?: string | undefined;
        error?: string | undefined;
        scoreId?: string | undefined;
        score?: string | number | boolean | undefined;
        rationale?: string | undefined;
        spanId?: string | undefined;
    }[] | undefined;
}, {
    testCaseId: string;
    traceIds: string[];
    input?: any;
    output?: any;
    context?: any[] | undefined;
    reference?: any;
    error?: string | undefined;
    metrics?: {
        evaluator: string;
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        traceId?: string | undefined;
        error?: string | undefined;
        scoreId?: string | undefined;
        score?: string | number | boolean | undefined;
        rationale?: string | undefined;
        spanId?: string | undefined;
    }[] | undefined;
}>;
export type EvalResult = z.infer<typeof EvalResultSchema>;
export declare const EvalRunKeySchema: z.ZodObject<{
    actionRef: z.ZodOptional<z.ZodString>;
    datasetId: z.ZodOptional<z.ZodString>;
    datasetVersion: z.ZodOptional<z.ZodNumber>;
    evalRunId: z.ZodString;
    createdAt: z.ZodString;
    actionConfig: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    evalRunId: string;
    createdAt: string;
    actionRef?: string | undefined;
    datasetId?: string | undefined;
    datasetVersion?: number | undefined;
    actionConfig?: any;
}, {
    evalRunId: string;
    createdAt: string;
    actionRef?: string | undefined;
    datasetId?: string | undefined;
    datasetVersion?: number | undefined;
    actionConfig?: any;
}>;
export type EvalRunKey = z.infer<typeof EvalRunKeySchema>;
export declare const EvalKeyAugmentsSchema: z.ZodObject<Pick<{
    actionRef: z.ZodOptional<z.ZodString>;
    datasetId: z.ZodOptional<z.ZodString>;
    datasetVersion: z.ZodOptional<z.ZodNumber>;
    evalRunId: z.ZodString;
    createdAt: z.ZodString;
    actionConfig: z.ZodOptional<z.ZodAny>;
}, "actionRef" | "datasetId" | "datasetVersion" | "actionConfig">, "strip", z.ZodTypeAny, {
    actionRef?: string | undefined;
    datasetId?: string | undefined;
    datasetVersion?: number | undefined;
    actionConfig?: any;
}, {
    actionRef?: string | undefined;
    datasetId?: string | undefined;
    datasetVersion?: number | undefined;
    actionConfig?: any;
}>;
export type EvalKeyAugments = z.infer<typeof EvalKeyAugmentsSchema>;
export declare const EvalRunSchema: z.ZodObject<{
    key: z.ZodObject<{
        actionRef: z.ZodOptional<z.ZodString>;
        datasetId: z.ZodOptional<z.ZodString>;
        datasetVersion: z.ZodOptional<z.ZodNumber>;
        evalRunId: z.ZodString;
        createdAt: z.ZodString;
        actionConfig: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        evalRunId: string;
        createdAt: string;
        actionRef?: string | undefined;
        datasetId?: string | undefined;
        datasetVersion?: number | undefined;
        actionConfig?: any;
    }, {
        evalRunId: string;
        createdAt: string;
        actionRef?: string | undefined;
        datasetId?: string | undefined;
        datasetVersion?: number | undefined;
        actionConfig?: any;
    }>;
    results: z.ZodArray<z.ZodObject<z.objectUtil.extendShape<{
        testCaseId: z.ZodString;
        input: z.ZodAny;
        output: z.ZodAny;
        error: z.ZodOptional<z.ZodString>;
        context: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
        reference: z.ZodOptional<z.ZodAny>;
        traceIds: z.ZodArray<z.ZodString, "many">;
    }, {
        metrics: z.ZodOptional<z.ZodArray<z.ZodObject<{
            evaluator: z.ZodString;
            scoreId: z.ZodOptional<z.ZodString>;
            score: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>>;
            status: z.ZodOptional<z.ZodEnum<["UNKNOWN", "PASS", "FAIL"]>>;
            rationale: z.ZodOptional<z.ZodString>;
            error: z.ZodOptional<z.ZodString>;
            traceId: z.ZodOptional<z.ZodString>;
            spanId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            evaluator: string;
            status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
            traceId?: string | undefined;
            error?: string | undefined;
            scoreId?: string | undefined;
            score?: string | number | boolean | undefined;
            rationale?: string | undefined;
            spanId?: string | undefined;
        }, {
            evaluator: string;
            status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
            traceId?: string | undefined;
            error?: string | undefined;
            scoreId?: string | undefined;
            score?: string | number | boolean | undefined;
            rationale?: string | undefined;
            spanId?: string | undefined;
        }>, "many">>;
    }>, "strip", z.ZodTypeAny, {
        testCaseId: string;
        traceIds: string[];
        input?: any;
        output?: any;
        context?: any[] | undefined;
        reference?: any;
        error?: string | undefined;
        metrics?: {
            evaluator: string;
            status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
            traceId?: string | undefined;
            error?: string | undefined;
            scoreId?: string | undefined;
            score?: string | number | boolean | undefined;
            rationale?: string | undefined;
            spanId?: string | undefined;
        }[] | undefined;
    }, {
        testCaseId: string;
        traceIds: string[];
        input?: any;
        output?: any;
        context?: any[] | undefined;
        reference?: any;
        error?: string | undefined;
        metrics?: {
            evaluator: string;
            status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
            traceId?: string | undefined;
            error?: string | undefined;
            scoreId?: string | undefined;
            score?: string | number | boolean | undefined;
            rationale?: string | undefined;
            spanId?: string | undefined;
        }[] | undefined;
    }>, "many">;
    metricsMetadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        displayName: z.ZodString;
        definition: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        displayName: string;
        definition: string;
    }, {
        displayName: string;
        definition: string;
    }>>>;
}, "strip", z.ZodTypeAny, {
    key: {
        evalRunId: string;
        createdAt: string;
        actionRef?: string | undefined;
        datasetId?: string | undefined;
        datasetVersion?: number | undefined;
        actionConfig?: any;
    };
    results: {
        testCaseId: string;
        traceIds: string[];
        input?: any;
        output?: any;
        context?: any[] | undefined;
        reference?: any;
        error?: string | undefined;
        metrics?: {
            evaluator: string;
            status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
            traceId?: string | undefined;
            error?: string | undefined;
            scoreId?: string | undefined;
            score?: string | number | boolean | undefined;
            rationale?: string | undefined;
            spanId?: string | undefined;
        }[] | undefined;
    }[];
    metricsMetadata?: Record<string, {
        displayName: string;
        definition: string;
    }> | undefined;
}, {
    key: {
        evalRunId: string;
        createdAt: string;
        actionRef?: string | undefined;
        datasetId?: string | undefined;
        datasetVersion?: number | undefined;
        actionConfig?: any;
    };
    results: {
        testCaseId: string;
        traceIds: string[];
        input?: any;
        output?: any;
        context?: any[] | undefined;
        reference?: any;
        error?: string | undefined;
        metrics?: {
            evaluator: string;
            status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
            traceId?: string | undefined;
            error?: string | undefined;
            scoreId?: string | undefined;
            score?: string | number | boolean | undefined;
            rationale?: string | undefined;
            spanId?: string | undefined;
        }[] | undefined;
    }[];
    metricsMetadata?: Record<string, {
        displayName: string;
        definition: string;
    }> | undefined;
}>;
export type EvalRun = z.infer<typeof EvalRunSchema>;
export interface EvalStore {
    save(evalRun: EvalRun): Promise<void>;
    load(evalRunId: string): Promise<EvalRun | undefined>;
    list(query?: ListEvalKeysRequest): Promise<ListEvalKeysResponse>;
}
export declare const DatasetSchemaSchema: z.ZodObject<{
    inputSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    referenceSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    inputSchema?: Record<string, any> | undefined;
    referenceSchema?: Record<string, any> | undefined;
}, {
    inputSchema?: Record<string, any> | undefined;
    referenceSchema?: Record<string, any> | undefined;
}>;
export declare const DatasetTypeSchema: z.ZodEnum<["UNKNOWN", "FLOW", "MODEL"]>;
export type DatasetType = z.infer<typeof DatasetTypeSchema>;
export declare const DatasetMetadataSchema: z.ZodObject<{
    datasetId: z.ZodString;
    size: z.ZodNumber;
    schema: z.ZodOptional<z.ZodObject<{
        inputSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        referenceSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        inputSchema?: Record<string, any> | undefined;
        referenceSchema?: Record<string, any> | undefined;
    }, {
        inputSchema?: Record<string, any> | undefined;
        referenceSchema?: Record<string, any> | undefined;
    }>>;
    datasetType: z.ZodEnum<["UNKNOWN", "FLOW", "MODEL"]>;
    targetAction: z.ZodOptional<z.ZodString>;
    version: z.ZodNumber;
    createTime: z.ZodString;
    updateTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    version: number;
    datasetId: string;
    size: number;
    datasetType: "UNKNOWN" | "FLOW" | "MODEL";
    createTime: string;
    updateTime: string;
    schema?: {
        inputSchema?: Record<string, any> | undefined;
        referenceSchema?: Record<string, any> | undefined;
    } | undefined;
    targetAction?: string | undefined;
}, {
    version: number;
    datasetId: string;
    size: number;
    datasetType: "UNKNOWN" | "FLOW" | "MODEL";
    createTime: string;
    updateTime: string;
    schema?: {
        inputSchema?: Record<string, any> | undefined;
        referenceSchema?: Record<string, any> | undefined;
    } | undefined;
    targetAction?: string | undefined;
}>;
export type DatasetMetadata = z.infer<typeof DatasetMetadataSchema>;
export interface DatasetStore {
    createDataset(req: CreateDatasetRequest): Promise<DatasetMetadata>;
    updateDataset(req: UpdateDatasetRequest): Promise<DatasetMetadata>;
    getDataset(datasetId: string): Promise<Dataset>;
    listDatasets(): Promise<DatasetMetadata[]>;
    deleteDataset(datasetId: string): Promise<void>;
}
