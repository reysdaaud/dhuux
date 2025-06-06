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

declare const ATTR_PREFIX = "genkit";
declare const SPAN_STATE_ATTR: string;
declare const BaseDataPointSchema: z.ZodObject<{
    input: z.ZodUnknown;
    output: z.ZodOptional<z.ZodUnknown>;
    context: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    reference: z.ZodOptional<z.ZodUnknown>;
    testCaseId: z.ZodOptional<z.ZodString>;
    traceIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    output?: unknown;
    context?: unknown[] | undefined;
    input?: unknown;
    reference?: unknown;
    testCaseId?: string | undefined;
    traceIds?: string[] | undefined;
}, {
    output?: unknown;
    context?: unknown[] | undefined;
    input?: unknown;
    reference?: unknown;
    testCaseId?: string | undefined;
    traceIds?: string[] | undefined;
}>;
declare const BaseEvalDataPointSchema: z.ZodObject<z.objectUtil.extendShape<{
    input: z.ZodUnknown;
    output: z.ZodOptional<z.ZodUnknown>;
    context: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    reference: z.ZodOptional<z.ZodUnknown>;
    testCaseId: z.ZodOptional<z.ZodString>;
    traceIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, {
    testCaseId: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    testCaseId: string;
    output?: unknown;
    context?: unknown[] | undefined;
    input?: unknown;
    reference?: unknown;
    traceIds?: string[] | undefined;
}, {
    testCaseId: string;
    output?: unknown;
    context?: unknown[] | undefined;
    input?: unknown;
    reference?: unknown;
    traceIds?: string[] | undefined;
}>;
type BaseEvalDataPoint = z.infer<typeof BaseEvalDataPointSchema>;
/** Enum that indicates if an evaluation has passed or failed */
declare enum EvalStatusEnum {
    UNKNOWN = "UNKNOWN",
    PASS = "PASS",
    FAIL = "FAIL"
}
declare const ScoreSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    score: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>>;
    status: z.ZodOptional<z.ZodEnum<["UNKNOWN", "PASS", "FAIL"]>>;
    error: z.ZodOptional<z.ZodString>;
    details: z.ZodOptional<z.ZodObject<{
        reasoning: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        reasoning: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        reasoning: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>>;
}, "strip", z.ZodTypeAny, {
    status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
    id?: string | undefined;
    error?: string | undefined;
    score?: string | number | boolean | undefined;
    details?: z.objectOutputType<{
        reasoning: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
}, {
    status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
    id?: string | undefined;
    error?: string | undefined;
    score?: string | number | boolean | undefined;
    details?: z.objectInputType<{
        reasoning: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
}>;
declare const EVALUATOR_METADATA_KEY_DISPLAY_NAME = "evaluatorDisplayName";
declare const EVALUATOR_METADATA_KEY_DEFINITION = "evaluatorDefinition";
declare const EVALUATOR_METADATA_KEY_IS_BILLED = "evaluatorIsBilled";
type Score = z.infer<typeof ScoreSchema>;
type BaseDataPoint = z.infer<typeof BaseDataPointSchema>;
type Dataset<DataPoint extends typeof BaseDataPointSchema = typeof BaseDataPointSchema> = Array<z.infer<DataPoint>>;
declare const EvalResponseSchema: z.ZodObject<{
    sampleIndex: z.ZodOptional<z.ZodNumber>;
    testCaseId: z.ZodString;
    traceId: z.ZodOptional<z.ZodString>;
    spanId: z.ZodOptional<z.ZodString>;
    evaluation: z.ZodUnion<[z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        score: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>>;
        status: z.ZodOptional<z.ZodEnum<["UNKNOWN", "PASS", "FAIL"]>>;
        error: z.ZodOptional<z.ZodString>;
        details: z.ZodOptional<z.ZodObject<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "strip", z.ZodTypeAny, {
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        id?: string | undefined;
        error?: string | undefined;
        score?: string | number | boolean | undefined;
        details?: z.objectOutputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }, {
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        id?: string | undefined;
        error?: string | undefined;
        score?: string | number | boolean | undefined;
        details?: z.objectInputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }>, z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        score: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>>;
        status: z.ZodOptional<z.ZodEnum<["UNKNOWN", "PASS", "FAIL"]>>;
        error: z.ZodOptional<z.ZodString>;
        details: z.ZodOptional<z.ZodObject<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "strip", z.ZodTypeAny, {
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        id?: string | undefined;
        error?: string | undefined;
        score?: string | number | boolean | undefined;
        details?: z.objectOutputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }, {
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        id?: string | undefined;
        error?: string | undefined;
        score?: string | number | boolean | undefined;
        details?: z.objectInputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }>, "many">]>;
}, "strip", z.ZodTypeAny, {
    testCaseId: string;
    evaluation: {
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        id?: string | undefined;
        error?: string | undefined;
        score?: string | number | boolean | undefined;
        details?: z.objectOutputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    } | {
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        id?: string | undefined;
        error?: string | undefined;
        score?: string | number | boolean | undefined;
        details?: z.objectOutputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }[];
    sampleIndex?: number | undefined;
    traceId?: string | undefined;
    spanId?: string | undefined;
}, {
    testCaseId: string;
    evaluation: {
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        id?: string | undefined;
        error?: string | undefined;
        score?: string | number | boolean | undefined;
        details?: z.objectInputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    } | {
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        id?: string | undefined;
        error?: string | undefined;
        score?: string | number | boolean | undefined;
        details?: z.objectInputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }[];
    sampleIndex?: number | undefined;
    traceId?: string | undefined;
    spanId?: string | undefined;
}>;
type EvalResponse = z.infer<typeof EvalResponseSchema>;
declare const EvalResponsesSchema: z.ZodArray<z.ZodObject<{
    sampleIndex: z.ZodOptional<z.ZodNumber>;
    testCaseId: z.ZodString;
    traceId: z.ZodOptional<z.ZodString>;
    spanId: z.ZodOptional<z.ZodString>;
    evaluation: z.ZodUnion<[z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        score: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>>;
        status: z.ZodOptional<z.ZodEnum<["UNKNOWN", "PASS", "FAIL"]>>;
        error: z.ZodOptional<z.ZodString>;
        details: z.ZodOptional<z.ZodObject<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "strip", z.ZodTypeAny, {
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        id?: string | undefined;
        error?: string | undefined;
        score?: string | number | boolean | undefined;
        details?: z.objectOutputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }, {
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        id?: string | undefined;
        error?: string | undefined;
        score?: string | number | boolean | undefined;
        details?: z.objectInputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }>, z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        score: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodBoolean]>>;
        status: z.ZodOptional<z.ZodEnum<["UNKNOWN", "PASS", "FAIL"]>>;
        error: z.ZodOptional<z.ZodString>;
        details: z.ZodOptional<z.ZodObject<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "strip", z.ZodTypeAny, {
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        id?: string | undefined;
        error?: string | undefined;
        score?: string | number | boolean | undefined;
        details?: z.objectOutputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }, {
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        id?: string | undefined;
        error?: string | undefined;
        score?: string | number | boolean | undefined;
        details?: z.objectInputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }>, "many">]>;
}, "strip", z.ZodTypeAny, {
    testCaseId: string;
    evaluation: {
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        id?: string | undefined;
        error?: string | undefined;
        score?: string | number | boolean | undefined;
        details?: z.objectOutputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    } | {
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        id?: string | undefined;
        error?: string | undefined;
        score?: string | number | boolean | undefined;
        details?: z.objectOutputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }[];
    sampleIndex?: number | undefined;
    traceId?: string | undefined;
    spanId?: string | undefined;
}, {
    testCaseId: string;
    evaluation: {
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        id?: string | undefined;
        error?: string | undefined;
        score?: string | number | boolean | undefined;
        details?: z.objectInputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    } | {
        status?: "UNKNOWN" | "PASS" | "FAIL" | undefined;
        id?: string | undefined;
        error?: string | undefined;
        score?: string | number | boolean | undefined;
        details?: z.objectInputType<{
            reasoning: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough"> | undefined;
    }[];
    sampleIndex?: number | undefined;
    traceId?: string | undefined;
    spanId?: string | undefined;
}>, "many">;
type EvalResponses = z.infer<typeof EvalResponsesSchema>;
type EvaluatorFn<EvalDataPoint extends typeof BaseEvalDataPointSchema = typeof BaseEvalDataPointSchema, CustomOptions extends z.ZodTypeAny = z.ZodTypeAny> = (input: z.infer<EvalDataPoint>, evaluatorOptions?: z.infer<CustomOptions>) => Promise<EvalResponse>;
type EvaluatorAction<DataPoint extends typeof BaseDataPointSchema = typeof BaseDataPointSchema, CustomOptions extends z.ZodTypeAny = z.ZodTypeAny> = Action<typeof EvalRequestSchema, typeof EvalResponsesSchema> & {
    __dataPointType?: DataPoint;
    __configSchema?: CustomOptions;
};
declare const EvalRequestSchema: z.ZodObject<{
    dataset: z.ZodArray<z.ZodObject<{
        input: z.ZodUnknown;
        output: z.ZodOptional<z.ZodUnknown>;
        context: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
        reference: z.ZodOptional<z.ZodUnknown>;
        testCaseId: z.ZodOptional<z.ZodString>;
        traceIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        output?: unknown;
        context?: unknown[] | undefined;
        input?: unknown;
        reference?: unknown;
        testCaseId?: string | undefined;
        traceIds?: string[] | undefined;
    }, {
        output?: unknown;
        context?: unknown[] | undefined;
        input?: unknown;
        reference?: unknown;
        testCaseId?: string | undefined;
        traceIds?: string[] | undefined;
    }>, "many">;
    evalRunId: z.ZodString;
    options: z.ZodUnknown;
}, "strip", z.ZodTypeAny, {
    dataset: {
        output?: unknown;
        context?: unknown[] | undefined;
        input?: unknown;
        reference?: unknown;
        testCaseId?: string | undefined;
        traceIds?: string[] | undefined;
    }[];
    evalRunId: string;
    options?: unknown;
}, {
    dataset: {
        output?: unknown;
        context?: unknown[] | undefined;
        input?: unknown;
        reference?: unknown;
        testCaseId?: string | undefined;
        traceIds?: string[] | undefined;
    }[];
    evalRunId: string;
    options?: unknown;
}>;
interface EvaluatorParams<DataPoint extends typeof BaseDataPointSchema = typeof BaseDataPointSchema, CustomOptions extends z.ZodTypeAny = z.ZodTypeAny> {
    evaluator: EvaluatorArgument<DataPoint, CustomOptions>;
    dataset: Dataset<DataPoint>;
    evalRunId?: string;
    options?: z.infer<CustomOptions>;
}
/**
 * Creates evaluator action for the provided {@link EvaluatorFn} implementation.
 */
declare function defineEvaluator<DataPoint extends typeof BaseDataPointSchema = typeof BaseDataPointSchema, EvalDataPoint extends typeof BaseEvalDataPointSchema = typeof BaseEvalDataPointSchema, EvaluatorOptions extends z.ZodTypeAny = z.ZodTypeAny>(registry: Registry, options: {
    name: string;
    displayName: string;
    definition: string;
    dataPointType?: DataPoint;
    configSchema?: EvaluatorOptions;
    isBilled?: boolean;
}, runner: EvaluatorFn<EvalDataPoint, EvaluatorOptions>): EvaluatorAction<DataPoint, EvaluatorOptions>;
type EvaluatorArgument<DataPoint extends typeof BaseDataPointSchema = typeof BaseDataPointSchema, CustomOptions extends z.ZodTypeAny = z.ZodTypeAny> = string | EvaluatorAction<DataPoint, CustomOptions> | EvaluatorReference<CustomOptions>;
/**
 * A veneer for interacting with evaluators.
 */
declare function evaluate<DataPoint extends typeof BaseDataPointSchema = typeof BaseDataPointSchema, CustomOptions extends z.ZodTypeAny = z.ZodTypeAny>(registry: Registry, params: EvaluatorParams<DataPoint, CustomOptions>): Promise<EvalResponses>;
declare const EvaluatorInfoSchema: z.ZodObject<{
    /** Friendly label for this evaluator */
    label: z.ZodOptional<z.ZodString>;
    metrics: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    metrics: string[];
    label?: string | undefined;
}, {
    metrics: string[];
    label?: string | undefined;
}>;
type EvaluatorInfo = z.infer<typeof EvaluatorInfoSchema>;
interface EvaluatorReference<CustomOptions extends z.ZodTypeAny> {
    name: string;
    configSchema?: CustomOptions;
    info?: EvaluatorInfo;
}
/**
 * Helper method to configure a {@link EvaluatorReference} to a plugin.
 */
declare function evaluatorRef<CustomOptionsSchema extends z.ZodTypeAny = z.ZodTypeAny>(options: EvaluatorReference<CustomOptionsSchema>): EvaluatorReference<CustomOptionsSchema>;

export { ATTR_PREFIX, type BaseDataPoint, BaseDataPointSchema, type BaseEvalDataPoint, BaseEvalDataPointSchema, type Dataset, EVALUATOR_METADATA_KEY_DEFINITION, EVALUATOR_METADATA_KEY_DISPLAY_NAME, EVALUATOR_METADATA_KEY_IS_BILLED, type EvalResponse, EvalResponseSchema, type EvalResponses, EvalResponsesSchema, EvalStatusEnum, type EvaluatorAction, type EvaluatorArgument, type EvaluatorFn, type EvaluatorInfo, EvaluatorInfoSchema, type EvaluatorParams, type EvaluatorReference, SPAN_STATE_ATTR, type Score, ScoreSchema, defineEvaluator, evaluate, evaluatorRef };
