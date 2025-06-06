import { TraceDataSchema } from '@genkit-ai/tools-common';
import express from 'express';
export { FirestoreTraceStore } from './firestoreTraceStore.js';
export { LocalFileTraceStore } from './localFileTraceStore.js';
let server;
export function startTelemetryServer(params) {
    const api = express();
    api.use(express.json({ limit: params.maxRequestBodySize ?? '30mb' }));
    api.get('/api/__health', async (_, response) => {
        response.status(200).send('OK');
    });
    api.get('/api/traces/:traceId', async (request, response, next) => {
        try {
            const { traceId } = request.params;
            response.json(await params.traceStore.load(traceId));
        }
        catch (e) {
            next(e);
        }
    });
    api.post('/api/traces', async (request, response, next) => {
        try {
            const traceData = TraceDataSchema.parse(request.body);
            await params.traceStore.save(traceData.traceId, traceData);
            response.status(200).send('OK');
        }
        catch (e) {
            next(e);
        }
    });
    api.get('/api/traces', async (request, response, next) => {
        try {
            const { limit, continuationToken } = request.query;
            response.json(await params.traceStore.list({
                limit: limit ? parseInt(limit.toString()) : undefined,
                continuationToken: continuationToken
                    ? continuationToken.toString()
                    : undefined,
            }));
        }
        catch (e) {
            next(e);
        }
    });
    api.use((err, req, res, next) => {
        console.error(err.stack);
        const error = err;
        const { message, stack } = error;
        const errorResponse = {
            code: 13,
            message,
            details: {
                stack,
                traceId: err.traceId,
            },
        };
        res.status(500).json(errorResponse);
    });
    server = api.listen(params.port, () => {
        console.log(`Telemetry API running on http://localhost:${params.port}`);
    });
    server.on('error', (error) => {
        console.error(error);
    });
    process.on('SIGTERM', async () => await stopTelemetryApi());
}
async function stopTelemetryApi() {
    await Promise.all([
        new Promise((resolve) => {
            if (server) {
                server.close(() => {
                    console.info('Telemetry API has succesfully shut down.');
                    resolve();
                });
            }
            else {
                resolve();
            }
        }),
    ]);
}
//# sourceMappingURL=index.js.map