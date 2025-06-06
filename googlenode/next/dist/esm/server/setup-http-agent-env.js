import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
export function setHttpClientAndAgentOptions(config) {
    if (globalThis.__NEXT_HTTP_AGENT) {
        // We only need to assign once because we want
        // to reuse the same agent for all requests.
        return;
    }
    if (!config) {
        throw Object.defineProperty(new Error('Expected config.httpAgentOptions to be an object'), "__NEXT_ERROR_CODE", {
            value: "E204",
            enumerable: false,
            configurable: true
        });
    }
    globalThis.__NEXT_HTTP_AGENT_OPTIONS = config.httpAgentOptions;
    globalThis.__NEXT_HTTP_AGENT = new HttpAgent(config.httpAgentOptions);
    globalThis.__NEXT_HTTPS_AGENT = new HttpsAgent(config.httpAgentOptions);
}

//# sourceMappingURL=setup-http-agent-env.js.map