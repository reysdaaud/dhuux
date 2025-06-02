import { genkitPlugin } from "genkit/plugin";
import {
  SUPPORTED_MODELS as EMBEDDER_MODELS,
  defineGoogleAIEmbedder,
  textEmbedding004,
  textEmbeddingGecko001
} from "./embedder.js";
import {
  SUPPORTED_V15_MODELS,
  SUPPORTED_V1_MODELS,
  defineGoogleAIModel,
  gemini,
  gemini10Pro,
  gemini15Flash,
  gemini15Flash8b,
  gemini15Pro,
  gemini20Flash,
  gemini20FlashExp,
  gemini20FlashLite,
  gemini20ProExp0205,
  gemini25FlashPreview0417,
  gemini25ProExp0325,
  gemini25ProPreview0325
} from "./gemini.js";
function googleAI(options) {
  return genkitPlugin("googleai", async (ai) => {
    let apiVersions = ["v1"];
    if (options?.apiVersion) {
      if (Array.isArray(options?.apiVersion)) {
        apiVersions = options?.apiVersion;
      } else {
        apiVersions = [options?.apiVersion];
      }
    }
    if (apiVersions.includes("v1beta")) {
      Object.keys(SUPPORTED_V15_MODELS).forEach(
        (name) => defineGoogleAIModel({
          ai,
          name,
          apiKey: options?.apiKey,
          apiVersion: "v1beta",
          baseUrl: options?.baseUrl,
          debugTraces: options?.experimental_debugTraces
        })
      );
    }
    if (apiVersions.includes("v1")) {
      Object.keys(SUPPORTED_V1_MODELS).forEach(
        (name) => defineGoogleAIModel({
          ai,
          name,
          apiKey: options?.apiKey,
          apiVersion: void 0,
          baseUrl: options?.baseUrl,
          debugTraces: options?.experimental_debugTraces
        })
      );
      Object.keys(SUPPORTED_V15_MODELS).forEach(
        (name) => defineGoogleAIModel({
          ai,
          name,
          apiKey: options?.apiKey,
          apiVersion: void 0,
          baseUrl: options?.baseUrl,
          debugTraces: options?.experimental_debugTraces
        })
      );
      Object.keys(EMBEDDER_MODELS).forEach(
        (name) => defineGoogleAIEmbedder(ai, name, { apiKey: options?.apiKey })
      );
    }
    if (options?.models) {
      for (const modelOrRef of options?.models) {
        const modelName = typeof modelOrRef === "string" ? modelOrRef : (
          // strip out the `googleai/` prefix
          modelOrRef.name.split("/")[1]
        );
        const modelRef = typeof modelOrRef === "string" ? gemini(modelOrRef) : modelOrRef;
        defineGoogleAIModel({
          ai,
          name: modelName,
          apiKey: options?.apiKey,
          baseUrl: options?.baseUrl,
          info: {
            ...modelRef.info,
            label: `Google AI - ${modelName}`
          },
          debugTraces: options?.experimental_debugTraces
        });
      }
    }
  });
}
var src_default = googleAI;
export {
  src_default as default,
  gemini,
  gemini10Pro,
  gemini15Flash,
  gemini15Flash8b,
  gemini15Pro,
  gemini20Flash,
  gemini20FlashExp,
  gemini20FlashLite,
  gemini20ProExp0205,
  gemini25FlashPreview0417,
  gemini25ProExp0325,
  gemini25ProPreview0325,
  googleAI,
  textEmbedding004,
  textEmbeddingGecko001
};
//# sourceMappingURL=index.mjs.map