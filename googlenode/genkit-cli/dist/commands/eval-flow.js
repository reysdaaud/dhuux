"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalFlow = void 0;
const tools_common_1 = require("@genkit-ai/tools-common");
const eval_1 = require("@genkit-ai/tools-common/eval");
const utils_1 = require("@genkit-ai/tools-common/utils");
const clc = __importStar(require("colorette"));
const commander_1 = require("commander");
const manager_utils_1 = require("../utils/manager-utils");
const EVAL_FLOW_SCHEMA = 'Array<{input: any; reference?: any;}>';
var SourceType;
(function (SourceType) {
    SourceType["DATA"] = "data";
    SourceType["FILE"] = "file";
    SourceType["DATASET"] = "dataset";
})(SourceType || (SourceType = {}));
exports.evalFlow = new commander_1.Command('eval:flow')
    .description('evaluate a flow against configured evaluators using provided data as input')
    .argument('<flowName>', 'Name of the flow to run')
    .argument('[data]', 'JSON data to use to start the flow')
    .option('--input <input>', 'Input dataset ID or JSON file to be used for evaluation')
    .option('-c, --context <JSON>', 'JSON object passed to context', '')
    .option('-o, --output <filename>', 'Name of the output file to write evaluation results. Defaults to json output.')
    .option('--output-format <format>', 'The output file format (csv, json)', 'json')
    .option('-e, --evaluators <evaluators>', 'comma separated list of evaluators to use (by default uses all)')
    .option('-f, --force', 'Automatically accept all interactive prompts')
    .action(async (flowName, data, options) => {
    await (0, manager_utils_1.runWithManager)(async (manager) => {
        const actionRef = `/flow/${flowName}`;
        if (!data && !options.input) {
            throw new Error('No input data passed. Specify input data using [data] argument or --input <filename> option');
        }
        const hasTargetAction = await (0, utils_1.hasAction)({ manager, actionRef });
        if (!hasTargetAction) {
            throw new Error(`Cannot find action ${actionRef}.`);
        }
        let evaluatorActions;
        if (!options.evaluators) {
            evaluatorActions = await (0, eval_1.getAllEvaluatorActions)(manager);
        }
        else {
            const evalActionKeys = options.evaluators
                .split(',')
                .map((k) => `/evaluator/${k}`);
            evaluatorActions = await (0, eval_1.getMatchingEvaluatorActions)(manager, evalActionKeys);
        }
        if (!evaluatorActions.length) {
            throw new Error(options.evaluators
                ? `No matching evaluators found for '${options.evaluators}'`
                : `No evaluators found in your app`);
        }
        utils_1.logger.debug(`Using evaluators: ${evaluatorActions.map((action) => action.name).join(',')}`);
        if (!options.force) {
            const confirmed = await (0, utils_1.confirmLlmUse)(evaluatorActions);
            if (!confirmed) {
                throw new Error('User declined using billed evaluators.');
            }
        }
        const sourceType = getSourceType(data, options.input);
        let targetDatasetMetadata;
        if (sourceType === SourceType.DATASET) {
            const datasetStore = await (0, eval_1.getDatasetStore)();
            const datasetMetadatas = await datasetStore.listDatasets();
            targetDatasetMetadata = datasetMetadatas.find((d) => d.datasetId === options.input);
        }
        const inferenceDataset = await readInputs(sourceType, data, options.input);
        const evalDataset = await (0, eval_1.runInference)({
            manager,
            actionRef,
            inferenceDataset,
            context: options.context,
        });
        const evalRun = await (0, eval_1.runEvaluation)({
            manager,
            evaluatorActions,
            evalDataset,
            augments: {
                actionRef: `/flow/${flowName}`,
                datasetId: sourceType === SourceType.DATASET ? options.input : undefined,
                datasetVersion: targetDatasetMetadata?.version,
            },
        });
        if (options.output) {
            const exportFn = (0, eval_1.getExporterForString)(options.outputFormat);
            await exportFn(evalRun, options.output);
        }
        const toolsInfo = manager.getMostRecentDevUI();
        if (toolsInfo) {
            utils_1.logger.info(clc.green(`\nView the evaluation results at: ${toolsInfo.url}/evaluate/${evalRun.key.evalRunId}`));
        }
        else {
            utils_1.logger.info(`Succesfully ran evaluation, with evalId: ${evalRun.key.evalRunId}`);
        }
    });
});
async function readInputs(sourceType, dataField, input) {
    let parsedData;
    switch (sourceType) {
        case SourceType.DATA:
            parsedData = JSON.parse(dataField);
            break;
        case SourceType.FILE:
            try {
                return await (0, utils_1.loadInferenceDatasetFile)(input);
            }
            catch (e) {
                throw new Error(`Error parsing the input from file. Error: ${e}`);
            }
        case SourceType.DATASET:
            const datasetStore = await (0, eval_1.getDatasetStore)();
            const data = await datasetStore.getDataset(input);
            parsedData = data;
            break;
    }
    try {
        return tools_common_1.DatasetSchema.parse(parsedData);
    }
    catch (e) {
        throw new Error(`Error parsing the input. Please provide an array of inputs for the flow or a ${EVAL_FLOW_SCHEMA} object. Error: ${e}`);
    }
}
function getSourceType(data, input) {
    if (input) {
        if (data) {
            utils_1.logger.warn('Both [data] and input provided, ignoring [data]...');
        }
        return input.endsWith('.json') || input.endsWith('.jsonl')
            ? SourceType.FILE
            : SourceType.DATASET;
    }
    else if (data) {
        return SourceType.DATA;
    }
    throw new Error('Must provide either data or input');
}
//# sourceMappingURL=eval-flow.js.map