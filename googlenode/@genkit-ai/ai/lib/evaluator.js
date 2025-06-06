"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var evaluator_exports = {};
__export(evaluator_exports, {
  ATTR_PREFIX: () => ATTR_PREFIX,
  BaseDataPointSchema: () => BaseDataPointSchema,
  BaseEvalDataPointSchema: () => BaseEvalDataPointSchema,
  EVALUATOR_METADATA_KEY_DEFINITION: () => EVALUATOR_METADATA_KEY_DEFINITION,
  EVALUATOR_METADATA_KEY_DISPLAY_NAME: () => EVALUATOR_METADATA_KEY_DISPLAY_NAME,
  EVALUATOR_METADATA_KEY_IS_BILLED: () => EVALUATOR_METADATA_KEY_IS_BILLED,
  EvalResponseSchema: () => EvalResponseSchema,
  EvalResponsesSchema: () => EvalResponsesSchema,
  EvalStatusEnum: () => EvalStatusEnum,
  EvaluatorInfoSchema: () => EvaluatorInfoSchema,
  SPAN_STATE_ATTR: () => SPAN_STATE_ATTR,
  ScoreSchema: () => ScoreSchema,
  defineEvaluator: () => defineEvaluator,
  evaluate: () => evaluate,
  evaluatorRef: () => evaluatorRef
});
module.exports = __toCommonJS(evaluator_exports);
var import_core = require("@genkit-ai/core");
var import_logging = require("@genkit-ai/core/logging");
var import_schema = require("@genkit-ai/core/schema");
var import_tracing = require("@genkit-ai/core/tracing");
var import_crypto = require("crypto");
const ATTR_PREFIX = "genkit";
const SPAN_STATE_ATTR = ATTR_PREFIX + ":state";
const BaseDataPointSchema = import_core.z.object({
  input: import_core.z.unknown(),
  output: import_core.z.unknown().optional(),
  context: import_core.z.array(import_core.z.unknown()).optional(),
  reference: import_core.z.unknown().optional(),
  testCaseId: import_core.z.string().optional(),
  traceIds: import_core.z.array(import_core.z.string()).optional()
});
const BaseEvalDataPointSchema = BaseDataPointSchema.extend({
  testCaseId: import_core.z.string()
});
const EvalStatusEnumSchema = import_core.z.enum(["UNKNOWN", "PASS", "FAIL"]);
var EvalStatusEnum = /* @__PURE__ */ ((EvalStatusEnum2) => {
  EvalStatusEnum2["UNKNOWN"] = "UNKNOWN";
  EvalStatusEnum2["PASS"] = "PASS";
  EvalStatusEnum2["FAIL"] = "FAIL";
  return EvalStatusEnum2;
})(EvalStatusEnum || {});
const ScoreSchema = import_core.z.object({
  id: import_core.z.string().describe(
    "Optional ID to differentiate different scores if applying in a single evaluation"
  ).optional(),
  score: import_core.z.union([import_core.z.number(), import_core.z.string(), import_core.z.boolean()]).optional(),
  status: EvalStatusEnumSchema.optional(),
  error: import_core.z.string().optional(),
  details: import_core.z.object({
    reasoning: import_core.z.string().optional()
  }).passthrough().optional()
});
const EVALUATOR_METADATA_KEY_DISPLAY_NAME = "evaluatorDisplayName";
const EVALUATOR_METADATA_KEY_DEFINITION = "evaluatorDefinition";
const EVALUATOR_METADATA_KEY_IS_BILLED = "evaluatorIsBilled";
const EvalResponseSchema = import_core.z.object({
  sampleIndex: import_core.z.number().optional(),
  testCaseId: import_core.z.string(),
  traceId: import_core.z.string().optional(),
  spanId: import_core.z.string().optional(),
  evaluation: import_core.z.union([ScoreSchema, import_core.z.array(ScoreSchema)])
});
const EvalResponsesSchema = import_core.z.array(EvalResponseSchema);
function withMetadata(evaluator, dataPointType, configSchema) {
  const withMeta = evaluator;
  withMeta.__dataPointType = dataPointType;
  withMeta.__configSchema = configSchema;
  return withMeta;
}
const EvalRequestSchema = import_core.z.object({
  dataset: import_core.z.array(BaseDataPointSchema),
  evalRunId: import_core.z.string(),
  options: import_core.z.unknown()
});
function defineEvaluator(registry, options, runner) {
  const evalMetadata = {};
  evalMetadata[EVALUATOR_METADATA_KEY_IS_BILLED] = options.isBilled == void 0 ? true : options.isBilled;
  evalMetadata[EVALUATOR_METADATA_KEY_DISPLAY_NAME] = options.displayName;
  evalMetadata[EVALUATOR_METADATA_KEY_DEFINITION] = options.definition;
  if (options.configSchema) {
    evalMetadata["customOptions"] = (0, import_schema.toJsonSchema)({
      schema: options.configSchema
    });
  }
  const evaluator = (0, import_core.defineAction)(
    registry,
    {
      actionType: "evaluator",
      name: options.name,
      inputSchema: EvalRequestSchema.extend({
        dataset: options.dataPointType ? import_core.z.array(options.dataPointType) : import_core.z.array(BaseDataPointSchema),
        options: options.configSchema ?? import_core.z.unknown(),
        evalRunId: import_core.z.string()
      }),
      outputSchema: EvalResponsesSchema,
      metadata: {
        type: "evaluator",
        evaluator: evalMetadata
      }
    },
    async (i) => {
      let evalResponses = [];
      for (let index = 0; index < i.dataset.length; index++) {
        const datapoint = {
          ...i.dataset[index],
          testCaseId: i.dataset[index].testCaseId ?? (0, import_crypto.randomUUID)()
        };
        try {
          await (0, import_tracing.runInNewSpan)(
            registry,
            {
              metadata: {
                name: `Test Case ${datapoint.testCaseId}`,
                metadata: { "evaluator:evalRunId": i.evalRunId }
              },
              labels: {
                [import_tracing.SPAN_TYPE_ATTR]: "evaluator"
              }
            },
            async (metadata, otSpan) => {
              const spanId = otSpan.spanContext().spanId;
              const traceId = otSpan.spanContext().traceId;
              try {
                metadata.input = {
                  input: datapoint.input,
                  output: datapoint.output,
                  context: datapoint.context
                };
                const testCaseOutput = await runner(datapoint, i.options);
                testCaseOutput.sampleIndex = index;
                testCaseOutput.spanId = spanId;
                testCaseOutput.traceId = traceId;
                metadata.output = testCaseOutput;
                evalResponses.push(testCaseOutput);
                return testCaseOutput;
              } catch (e) {
                evalResponses.push({
                  sampleIndex: index,
                  spanId,
                  traceId,
                  testCaseId: datapoint.testCaseId,
                  evaluation: {
                    error: `Evaluation of test case ${datapoint.testCaseId} failed: 
${e.stack}`,
                    status: "FAIL" /* FAIL */
                  }
                });
                throw e;
              }
            }
          );
        } catch (e) {
          import_logging.logger.error(
            `Evaluation of test case ${datapoint.testCaseId} failed: 
${e.stack}`
          );
          continue;
        }
      }
      return evalResponses;
    }
  );
  const ewm = withMetadata(
    evaluator,
    options.dataPointType,
    options.configSchema
  );
  return ewm;
}
async function evaluate(registry, params) {
  let evaluator;
  if (typeof params.evaluator === "string") {
    evaluator = await registry.lookupAction(`/evaluator/${params.evaluator}`);
  } else if (Object.hasOwnProperty.call(params.evaluator, "info")) {
    evaluator = await registry.lookupAction(
      `/evaluator/${params.evaluator.name}`
    );
  } else {
    evaluator = params.evaluator;
  }
  if (!evaluator) {
    throw new Error("Unable to utilize the provided evaluator");
  }
  return await evaluator({
    dataset: params.dataset,
    options: params.options,
    evalRunId: params.evalRunId ?? (0, import_crypto.randomUUID)()
  });
}
const EvaluatorInfoSchema = import_core.z.object({
  /** Friendly label for this evaluator */
  label: import_core.z.string().optional(),
  metrics: import_core.z.array(import_core.z.string())
});
function evaluatorRef(options) {
  return { ...options };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ATTR_PREFIX,
  BaseDataPointSchema,
  BaseEvalDataPointSchema,
  EVALUATOR_METADATA_KEY_DEFINITION,
  EVALUATOR_METADATA_KEY_DISPLAY_NAME,
  EVALUATOR_METADATA_KEY_IS_BILLED,
  EvalResponseSchema,
  EvalResponsesSchema,
  EvalStatusEnum,
  EvaluatorInfoSchema,
  SPAN_STATE_ATTR,
  ScoreSchema,
  defineEvaluator,
  evaluate,
  evaluatorRef
});
//# sourceMappingURL=evaluator.js.map