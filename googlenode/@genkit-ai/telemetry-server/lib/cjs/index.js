"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTelemetryServer = exports.LocalFileTraceStore = exports.FirestoreTraceStore = void 0;
const tools_common_1 = require("@genkit-ai/tools-common");
const express_1 = __importDefault(require("express"));
var firestoreTraceStore_js_1 = require("./firestoreTraceStore.js");
Object.defineProperty(exports, "FirestoreTraceStore", { enumerable: true, get: function () { return firestoreTraceStore_js_1.FirestoreTraceStore; } });
var localFileTraceStore_js_1 = require("./localFileTraceStore.js");
Object.defineProperty(exports, "LocalFileTraceStore", { enumerable: true, get: function () { return localFileTraceStore_js_1.LocalFileTraceStore; } });
let server;
function startTelemetryServer(params) {
    const api = (0, express_1.default)();
    api.use(express_1.default.json({ limit: params.maxRequestBodySize ?? '30mb' }));
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
            const traceData = tools_common_1.TraceDataSchema.parse(request.body);
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
exports.startTelemetryServer = startTelemetryServer;
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