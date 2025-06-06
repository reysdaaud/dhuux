"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _posttelemetrypayload = require("./post-telemetry-payload");
describe('postNextTelemetryPayload', ()=>{
    let originalFetch;
    beforeEach(()=>{
        originalFetch = global.fetch;
    });
    afterEach(()=>{
        global.fetch = originalFetch;
    });
    it('sends telemetry payload successfully', async ()=>{
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true
        });
        global.fetch = mockFetch;
        const payload = {
            meta: {
                version: '1.0'
            },
            context: {
                anonymousId: 'test-id',
                projectId: 'test-project',
                sessionId: 'test-session'
            },
            events: [
                {
                    eventName: 'test-event',
                    fields: {
                        foo: 'bar'
                    }
                }
            ]
        };
        await (0, _posttelemetrypayload.postNextTelemetryPayload)(payload);
        expect(mockFetch).toHaveBeenCalledWith('https://telemetry.nextjs.org/api/v1/record', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'content-type': 'application/json'
            },
            signal: expect.any(AbortSignal)
        });
    });
    it('retries on failure', async ()=>{
        const mockFetch = jest.fn().mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
            ok: true
        });
        global.fetch = mockFetch;
        const payload = {
            meta: {},
            context: {
                anonymousId: 'test-id',
                projectId: 'test-project',
                sessionId: 'test-session'
            },
            events: []
        };
        await (0, _posttelemetrypayload.postNextTelemetryPayload)(payload);
        expect(mockFetch).toHaveBeenCalledTimes(2);
    });
    it('swallows errors after retries exhausted', async ()=>{
        const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
        global.fetch = mockFetch;
        const payload = {
            meta: {},
            context: {
                anonymousId: 'test-id',
                projectId: 'test-project',
                sessionId: 'test-session'
            },
            events: []
        };
        // Should not throw
        await (0, _posttelemetrypayload.postNextTelemetryPayload)(payload);
        expect(mockFetch).toHaveBeenCalledTimes(2) // Initial try + 1 retry
        ;
    });
});

//# sourceMappingURL=post-telemetry-payload.test.js.map