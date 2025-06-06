import { RuntimeManager } from '../manager';
import { Action, Dataset, EvalInputDataset, GenerateRequest, TraceData } from '../types';
export type EvalExtractorFn = (t: TraceData) => any;
export declare const EVALUATOR_ACTION_PREFIX = "/evaluator";
export declare const EVALUATOR_METADATA_KEY_DISPLAY_NAME = "evaluatorDisplayName";
export declare const EVALUATOR_METADATA_KEY_DEFINITION = "evaluatorDefinition";
export declare const EVALUATOR_METADATA_KEY_IS_BILLED = "evaluatorIsBilled";
export declare function evaluatorName(action: Action): string;
export declare function isEvaluator(key: string): boolean;
export declare function confirmLlmUse(evaluatorActions: Action[]): Promise<boolean>;
export declare function getEvalExtractors(actionRef: string): Promise<Record<string, EvalExtractorFn>>;
export declare function generateTestCaseId(): `${string}-${string}-${string}-${string}-${string}`;
export declare function loadInferenceDatasetFile(fileName: string): Promise<Dataset>;
export declare function loadEvaluationDatasetFile(fileName: string): Promise<EvalInputDataset>;
export declare function hasAction(params: {
    manager: RuntimeManager;
    actionRef: string;
}): Promise<boolean>;
export declare function getModelInput(data: any, modelConfig: any): GenerateRequest;
