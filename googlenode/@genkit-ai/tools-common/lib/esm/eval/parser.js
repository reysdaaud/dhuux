import { EVALUATOR_METADATA_KEY_DEFINITION, EVALUATOR_METADATA_KEY_DISPLAY_NAME, } from '../utils/eval';
export function enrichResultsWithScoring(scores, evalDataset) {
    const scoreMap = {};
    Object.keys(scores).forEach((evaluator) => {
        const evaluatorResponse = scores[evaluator];
        evaluatorResponse.forEach((scoredSample) => {
            if (!scoredSample.testCaseId) {
                throw new Error('testCaseId expected to be present');
            }
            const score = Array.isArray(scoredSample.evaluation)
                ? scoredSample.evaluation
                : [scoredSample.evaluation];
            const existingScores = scoreMap[scoredSample.testCaseId] ?? [];
            const newScores = existingScores.concat(score.map((s) => ({
                evaluator,
                score: s.score,
                scoreId: s.id,
                status: s.status,
                rationale: s.details?.reasoning,
                error: s.error,
                traceId: scoredSample.traceId,
                spanId: scoredSample.spanId,
            })));
            scoreMap[scoredSample.testCaseId] = newScores;
        });
    });
    return evalDataset.map((evalResult) => {
        return {
            ...evalResult,
            metrics: scoreMap[evalResult.testCaseId] ?? [],
        };
    });
}
export function extractMetricsMetadata(evaluatorActions) {
    const metadata = {};
    for (const action of evaluatorActions) {
        metadata[action.name] = {
            displayName: action.metadata.evaluator[EVALUATOR_METADATA_KEY_DISPLAY_NAME],
            definition: action.metadata.evaluator[EVALUATOR_METADATA_KEY_DEFINITION],
        };
    }
    return metadata;
}
//# sourceMappingURL=parser.js.map