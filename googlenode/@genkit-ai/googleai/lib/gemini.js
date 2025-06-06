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
var gemini_exports = {};
__export(gemini_exports, {
  GENERIC_GEMINI_MODEL: () => GENERIC_GEMINI_MODEL,
  GeminiConfigSchema: () => GeminiConfigSchema,
  SUPPORTED_GEMINI_MODELS: () => SUPPORTED_GEMINI_MODELS,
  SUPPORTED_V15_MODELS: () => SUPPORTED_V15_MODELS,
  SUPPORTED_V1_MODELS: () => SUPPORTED_V1_MODELS,
  cleanSchema: () => cleanSchema,
  defineGoogleAIModel: () => defineGoogleAIModel,
  fromGeminiCandidate: () => fromGeminiCandidate,
  gemini: () => gemini,
  gemini10Pro: () => gemini10Pro,
  gemini15Flash: () => gemini15Flash,
  gemini15Flash8b: () => gemini15Flash8b,
  gemini15Pro: () => gemini15Pro,
  gemini20Flash: () => gemini20Flash,
  gemini20FlashExp: () => gemini20FlashExp,
  gemini20FlashLite: () => gemini20FlashLite,
  gemini20ProExp0205: () => gemini20ProExp0205,
  gemini25FlashPreview0417: () => gemini25FlashPreview0417,
  gemini25ProExp0325: () => gemini25ProExp0325,
  gemini25ProPreview0325: () => gemini25ProPreview0325,
  toGeminiMessage: () => toGeminiMessage,
  toGeminiSystemInstruction: () => toGeminiSystemInstruction,
  toGeminiTool: () => toGeminiTool
});
module.exports = __toCommonJS(gemini_exports);
var import_generative_ai = require("@google/generative-ai");
var import_genkit = require("genkit");
var import_model = require("genkit/model");
var import_middleware = require("genkit/model/middleware");
var import_tracing = require("genkit/tracing");
var import_common = require("./common");
var import_context_caching = require("./context-caching");
var import_utils = require("./context-caching/utils");
const SafetySettingsSchema = import_genkit.z.object({
  category: import_genkit.z.enum([
    "HARM_CATEGORY_UNSPECIFIED",
    "HARM_CATEGORY_HATE_SPEECH",
    "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "HARM_CATEGORY_HARASSMENT",
    "HARM_CATEGORY_DANGEROUS_CONTENT",
    "HARM_CATEGORY_CIVIC_INTEGRITY"
  ]),
  threshold: import_genkit.z.enum([
    "BLOCK_LOW_AND_ABOVE",
    "BLOCK_MEDIUM_AND_ABOVE",
    "BLOCK_ONLY_HIGH",
    "BLOCK_NONE"
  ])
});
const GeminiConfigSchema = import_model.GenerationCommonConfigSchema.extend({
  apiKey: import_genkit.z.string().describe("Overrides the plugin-configured API key, if specified.").optional(),
  safetySettings: import_genkit.z.array(SafetySettingsSchema).describe(
    "Adjust how likely you are to see responses that could be harmful. Content is blocked based on the probability that it is harmful."
  ).optional(),
  codeExecution: import_genkit.z.union([import_genkit.z.boolean(), import_genkit.z.object({}).strict()]).describe("Enables the model to generate and run code.").optional(),
  contextCache: import_genkit.z.boolean().describe(
    "Context caching allows you to save and reuse precomputed input tokens that you wish to use repeatedly."
  ).optional(),
  functionCallingConfig: import_genkit.z.object({
    mode: import_genkit.z.enum(["MODE_UNSPECIFIED", "AUTO", "ANY", "NONE"]).optional(),
    allowedFunctionNames: import_genkit.z.array(import_genkit.z.string()).optional()
  }).describe(
    "Controls how the model uses the provided tools (function declarations). With AUTO (Default) mode, the model decides whether to generate a natural language response or suggest a function call based on the prompt and context. With ANY, the model is constrained to always predict a function call and guarantee function schema adherence. With NONE, the model is prohibited from making function calls."
  ).optional(),
  responseModalities: import_genkit.z.array(import_genkit.z.enum(["TEXT", "IMAGE", "AUDIO"])).describe(
    "The modalities to be used in response. Only supported for 'gemini-2.0-flash-exp' model at present."
  ).optional()
});
const gemini10Pro = (0, import_model.modelRef)({
  name: "googleai/gemini-1.0-pro",
  info: {
    label: "Google AI - Gemini Pro",
    versions: ["gemini-pro", "gemini-1.0-pro-latest", "gemini-1.0-pro-001"],
    supports: {
      multiturn: true,
      media: false,
      tools: true,
      toolChoice: true,
      systemRole: true,
      constrained: "no-tools"
    }
  },
  configSchema: GeminiConfigSchema
});
const gemini15Pro = (0, import_model.modelRef)({
  name: "googleai/gemini-1.5-pro",
  info: {
    label: "Google AI - Gemini 1.5 Pro",
    supports: {
      multiturn: true,
      media: true,
      tools: true,
      toolChoice: true,
      systemRole: true,
      constrained: "no-tools"
    },
    versions: [
      "gemini-1.5-pro-latest",
      "gemini-1.5-pro-001",
      "gemini-1.5-pro-002"
    ]
  },
  configSchema: GeminiConfigSchema
});
const gemini15Flash = (0, import_model.modelRef)({
  name: "googleai/gemini-1.5-flash",
  info: {
    label: "Google AI - Gemini 1.5 Flash",
    supports: {
      multiturn: true,
      media: true,
      tools: true,
      toolChoice: true,
      systemRole: true,
      constrained: "no-tools",
      // @ts-ignore
      contextCache: true
    },
    versions: [
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash-001",
      "gemini-1.5-flash-002"
    ]
  },
  configSchema: GeminiConfigSchema
});
const gemini15Flash8b = (0, import_model.modelRef)({
  name: "googleai/gemini-1.5-flash-8b",
  info: {
    label: "Google AI - Gemini 1.5 Flash",
    supports: {
      multiturn: true,
      media: true,
      tools: true,
      toolChoice: true,
      systemRole: true,
      constrained: "no-tools"
    },
    versions: ["gemini-1.5-flash-8b-latest", "gemini-1.5-flash-8b-001"]
  },
  configSchema: GeminiConfigSchema
});
const gemini20Flash = (0, import_model.modelRef)({
  name: "googleai/gemini-2.0-flash",
  info: {
    label: "Google AI - Gemini 2.0 Flash",
    versions: [],
    supports: {
      multiturn: true,
      media: true,
      tools: true,
      toolChoice: true,
      systemRole: true,
      constrained: "no-tools"
    }
  },
  configSchema: GeminiConfigSchema
});
const gemini20FlashExp = (0, import_model.modelRef)({
  name: "googleai/gemini-2.0-flash-exp",
  info: {
    label: "Google AI - Gemini 2.0 Flash (Experimental)",
    versions: [],
    supports: {
      multiturn: true,
      media: true,
      tools: true,
      toolChoice: true,
      systemRole: true,
      constrained: "no-tools"
    }
  },
  configSchema: GeminiConfigSchema
});
const gemini20FlashLite = (0, import_model.modelRef)({
  name: "googleai/gemini-2.0-flash-lite",
  info: {
    label: "Google AI - Gemini 2.0 Flash Lite",
    versions: [],
    supports: {
      multiturn: true,
      media: true,
      tools: true,
      toolChoice: true,
      systemRole: true,
      constrained: "no-tools"
    }
  },
  configSchema: GeminiConfigSchema
});
const gemini20ProExp0205 = (0, import_model.modelRef)({
  name: "googleai/gemini-2.0-pro-exp-02-05",
  info: {
    label: "Google AI - Gemini 2.0 Pro Exp 02-05",
    versions: [],
    supports: {
      multiturn: true,
      media: true,
      tools: true,
      toolChoice: true,
      systemRole: true,
      constrained: "no-tools"
    }
  },
  configSchema: GeminiConfigSchema
});
const gemini25FlashPreview0417 = (0, import_model.modelRef)({
  name: "googleai/gemini-2.5-flash-preview-04-17",
  info: {
    label: "Google AI - Gemini 2.5 Flash Preview 04-17",
    versions: [],
    supports: {
      multiturn: true,
      media: true,
      tools: true,
      toolChoice: true,
      systemRole: true,
      constrained: "no-tools"
    }
  },
  configSchema: GeminiConfigSchema
});
const gemini25ProExp0325 = (0, import_model.modelRef)({
  name: "googleai/gemini-2.5-pro-exp-03-25",
  info: {
    label: "Google AI - Gemini 2.5 Pro Exp 03-25",
    versions: [],
    supports: {
      multiturn: true,
      media: true,
      tools: true,
      toolChoice: true,
      systemRole: true,
      constrained: "no-tools"
    }
  },
  configSchema: GeminiConfigSchema
});
const gemini25ProPreview0325 = (0, import_model.modelRef)({
  name: "googleai/gemini-2.5-pro-preview-03-25",
  info: {
    label: "Google AI - Gemini 2.5 Pro Preview 03-25",
    versions: [],
    supports: {
      multiturn: true,
      media: true,
      tools: true,
      toolChoice: true,
      systemRole: true,
      constrained: "no-tools"
    }
  },
  configSchema: GeminiConfigSchema
});
const SUPPORTED_V1_MODELS = {
  "gemini-1.0-pro": gemini10Pro
};
const SUPPORTED_V15_MODELS = {
  "gemini-1.5-pro": gemini15Pro,
  "gemini-1.5-flash": gemini15Flash,
  "gemini-1.5-flash-8b": gemini15Flash8b,
  "gemini-2.0-flash": gemini20Flash,
  "gemini-2.0-flash-lite": gemini20FlashLite,
  "gemini-2.0-pro-exp-02-05": gemini20ProExp0205,
  "gemini-2.0-flash-exp": gemini20FlashExp,
  "gemini-2.5-pro-exp-03-25": gemini25ProExp0325,
  "gemini-2.5-pro-preview-03-25": gemini25ProPreview0325,
  "gemini-2.5-flash-preview-04-17": gemini25FlashPreview0417
};
const GENERIC_GEMINI_MODEL = (0, import_model.modelRef)({
  name: "googleai/gemini",
  configSchema: GeminiConfigSchema,
  info: {
    label: "Google Gemini",
    supports: {
      multiturn: true,
      media: true,
      tools: true,
      toolChoice: true,
      systemRole: true,
      constrained: "no-tools"
    }
  }
});
const SUPPORTED_GEMINI_MODELS = {
  ...SUPPORTED_V1_MODELS,
  ...SUPPORTED_V15_MODELS
};
function longestMatchingPrefix(version, potentialMatches) {
  return potentialMatches.filter((p) => version.startsWith(p)).reduce(
    (longest, current) => current.length > longest.length ? current : longest,
    ""
  );
}
function gemini(version, options = {}) {
  const nearestModel = nearestGeminiModelRef(version);
  return (0, import_model.modelRef)({
    name: `googleai/${version}`,
    config: options,
    configSchema: GeminiConfigSchema,
    info: {
      ...nearestModel.info,
      // If exact suffix match for a known model, use its label, otherwise create a new label
      label: nearestModel.name.endsWith(version) ? nearestModel.info?.label : `Google AI - ${version}`
    }
  });
}
function nearestGeminiModelRef(version, options = {}) {
  const matchingKey = longestMatchingPrefix(
    version,
    Object.keys(SUPPORTED_GEMINI_MODELS)
  );
  if (matchingKey) {
    return SUPPORTED_GEMINI_MODELS[matchingKey].withConfig({
      ...options,
      version
    });
  }
  return GENERIC_GEMINI_MODEL.withConfig({ ...options, version });
}
function toGeminiRole(role, model) {
  switch (role) {
    case "user":
      return "user";
    case "model":
      return "model";
    case "system":
      if (model && SUPPORTED_V15_MODELS[model.name]) {
        throw new Error(
          "system role is only supported for a single message in the first position"
        );
      } else {
        throw new Error("system role is not supported");
      }
    case "tool":
      return "function";
    default:
      return "user";
  }
}
function convertSchemaProperty(property) {
  if (!property || !property.type) {
    return void 0;
  }
  const baseSchema = {};
  if (property.description) {
    baseSchema.description = property.description;
  }
  if (property.enum) {
    baseSchema.type = import_generative_ai.SchemaType.STRING;
    baseSchema.enum = property.enum;
  }
  if (property.nullable) {
    baseSchema.nullable = property.nullable;
  }
  let propertyType;
  if (Array.isArray(property.type)) {
    const types = property.type;
    if (types.includes("null")) {
      baseSchema.nullable = true;
    }
    propertyType = types.find((t) => t !== "null");
  } else {
    propertyType = property.type;
  }
  if (propertyType === "object") {
    const nestedProperties = {};
    Object.keys(property.properties).forEach((key) => {
      nestedProperties[key] = convertSchemaProperty(property.properties[key]);
    });
    return {
      ...baseSchema,
      type: import_generative_ai.SchemaType.OBJECT,
      properties: nestedProperties,
      required: property.required
    };
  } else if (propertyType === "array") {
    return {
      ...baseSchema,
      type: import_generative_ai.SchemaType.ARRAY,
      items: convertSchemaProperty(property.items)
    };
  } else {
    const schemaType = import_generative_ai.SchemaType[propertyType.toUpperCase()];
    if (!schemaType) {
      throw new import_genkit.GenkitError({
        status: "INVALID_ARGUMENT",
        message: `Unsupported property type ${propertyType.toUpperCase()}`
      });
    }
    return {
      ...baseSchema,
      type: schemaType
    };
  }
}
function toGeminiTool(tool) {
  const declaration = {
    name: tool.name.replace(/\//g, "__"),
    // Gemini throws on '/' in tool name
    description: tool.description,
    parameters: convertSchemaProperty(tool.inputSchema)
  };
  return declaration;
}
function toInlineData(part) {
  const dataUrl = part.media.url;
  const b64Data = dataUrl.substring(dataUrl.indexOf(",") + 1);
  const contentType = part.media.contentType || dataUrl.substring(dataUrl.indexOf(":") + 1, dataUrl.indexOf(";"));
  return { inlineData: { mimeType: contentType, data: b64Data } };
}
function toFileData(part) {
  if (!part.media.contentType)
    throw new Error(
      "Must supply a `contentType` when sending File URIs to Gemini."
    );
  return {
    fileData: { mimeType: part.media.contentType, fileUri: part.media.url }
  };
}
function fromInlineData(inlinePart) {
  if (!inlinePart.inlineData || !inlinePart.inlineData.hasOwnProperty("mimeType") || !inlinePart.inlineData.hasOwnProperty("data")) {
    throw new Error("Invalid InlineDataPart: missing required properties");
  }
  const { mimeType, data } = inlinePart.inlineData;
  const dataUrl = `data:${mimeType};base64,${data}`;
  return {
    media: {
      url: dataUrl,
      contentType: mimeType
    }
  };
}
function toFunctionCall(part) {
  if (!part?.toolRequest?.input) {
    throw Error("Invalid ToolRequestPart: input was missing.");
  }
  return {
    functionCall: {
      name: part.toolRequest.name,
      args: part.toolRequest.input
    }
  };
}
function fromFunctionCall(part, ref) {
  if (!part.functionCall) {
    throw Error("Invalid FunctionCallPart");
  }
  return {
    toolRequest: {
      name: part.functionCall.name,
      input: part.functionCall.args,
      ref
    }
  };
}
function toFunctionResponse(part) {
  if (!part?.toolResponse?.output) {
    throw Error("Invalid ToolResponsePart: output was missing.");
  }
  return {
    functionResponse: {
      name: part.toolResponse.name,
      response: {
        name: part.toolResponse.name,
        content: part.toolResponse.output
      }
    }
  };
}
function fromFunctionResponse(part) {
  if (!part.functionResponse) {
    throw new Error("Invalid FunctionResponsePart.");
  }
  return {
    toolResponse: {
      name: part.functionResponse.name.replace(/__/g, "/"),
      // restore slashes
      output: part.functionResponse.response
    }
  };
}
function fromExecutableCode(part) {
  if (!part.executableCode) {
    throw new Error("Invalid GeminiPart: missing executableCode");
  }
  return {
    custom: {
      executableCode: {
        language: part.executableCode.language,
        code: part.executableCode.code
      }
    }
  };
}
function fromCodeExecutionResult(part) {
  if (!part.codeExecutionResult) {
    throw new Error("Invalid GeminiPart: missing codeExecutionResult");
  }
  return {
    custom: {
      codeExecutionResult: {
        outcome: part.codeExecutionResult.outcome,
        output: part.codeExecutionResult.output
      }
    }
  };
}
function toCustomPart(part) {
  if (!part.custom) {
    throw new Error("Invalid GeminiPart: missing custom");
  }
  if (part.custom.codeExecutionResult) {
    return { codeExecutionResult: part.custom.codeExecutionResult };
  }
  if (part.custom.executableCode) {
    return { executableCode: part.custom.executableCode };
  }
  throw new Error("Unsupported Custom Part type");
}
function toGeminiPart(part) {
  if (part.text !== void 0) return { text: part.text || " " };
  if (part.media) {
    if (part.media.url.startsWith("data:")) return toInlineData(part);
    return toFileData(part);
  }
  if (part.toolRequest) return toFunctionCall(part);
  if (part.toolResponse) return toFunctionResponse(part);
  if (part.custom) return toCustomPart(part);
  throw new Error("Unsupported Part type" + JSON.stringify(part));
}
function fromGeminiPart(part, jsonMode, ref) {
  if (part.text !== void 0) return { text: part.text };
  if (part.inlineData) return fromInlineData(part);
  if (part.functionCall) return fromFunctionCall(part, ref);
  if (part.functionResponse) return fromFunctionResponse(part);
  if (part.executableCode) return fromExecutableCode(part);
  if (part.codeExecutionResult) return fromCodeExecutionResult(part);
  throw new Error("Unsupported GeminiPart type");
}
function toGeminiMessage(message, model) {
  let sortedParts = message.content;
  if (message.role === "tool") {
    sortedParts = [...message.content].sort((a, b) => {
      const aRef = a.toolResponse?.ref;
      const bRef = b.toolResponse?.ref;
      if (!aRef && !bRef) return 0;
      if (!aRef) return 1;
      if (!bRef) return -1;
      return parseInt(aRef, 10) - parseInt(bRef, 10);
    });
  }
  return {
    role: toGeminiRole(message.role, model),
    parts: sortedParts.map(toGeminiPart)
  };
}
function toGeminiSystemInstruction(message) {
  return {
    role: "user",
    parts: message.content.map(toGeminiPart)
  };
}
function fromGeminiFinishReason(reason) {
  if (!reason) return "unknown";
  switch (reason) {
    case "STOP":
      return "stop";
    case "MAX_TOKENS":
      return "length";
    case "SAFETY":
    // blocked for safety
    case "RECITATION":
      return "blocked";
    default:
      return "unknown";
  }
}
function fromGeminiCandidate(candidate, jsonMode = false) {
  const parts = candidate.content?.parts || [];
  const genkitCandidate = {
    index: candidate.index || 0,
    message: {
      role: "model",
      content: parts.map(
        (part, index) => fromGeminiPart(part, jsonMode, index.toString())
      )
    },
    finishReason: fromGeminiFinishReason(candidate.finishReason),
    finishMessage: candidate.finishMessage,
    custom: {
      safetyRatings: candidate.safetyRatings,
      citationMetadata: candidate.citationMetadata
    }
  };
  return genkitCandidate;
}
function cleanSchema(schema) {
  const out = structuredClone(schema);
  for (const key in out) {
    if (key === "$schema" || key === "additionalProperties") {
      delete out[key];
      continue;
    }
    if (typeof out[key] === "object") {
      out[key] = cleanSchema(out[key]);
    }
    if (key === "type" && Array.isArray(out[key])) {
      out[key] = out[key].find((t) => t !== "null");
    }
  }
  return out;
}
function defineGoogleAIModel({
  ai,
  name,
  apiKey: apiKeyOption,
  apiVersion,
  baseUrl,
  info,
  defaultConfig,
  debugTraces
}) {
  let apiKey;
  if (apiKeyOption !== false) {
    apiKey = apiKeyOption || (0, import_common.getApiKeyFromEnvVar)();
    if (!apiKey) {
      throw new import_genkit.GenkitError({
        status: "FAILED_PRECONDITION",
        message: "Please pass in the API key or set the GEMINI_API_KEY or GOOGLE_API_KEY environment variable.\nFor more details see https://firebase.google.com/docs/genkit/plugins/google-genai"
      });
    }
  }
  const apiModelName = name.startsWith("googleai/") ? name.substring("googleai/".length) : name;
  const model = SUPPORTED_GEMINI_MODELS[name] ?? (0, import_model.modelRef)({
    name: `googleai/${apiModelName}`,
    info: {
      label: `Google AI - ${apiModelName}`,
      supports: {
        multiturn: true,
        media: true,
        tools: true,
        systemRole: true,
        output: ["text", "json"]
      },
      ...info
    },
    configSchema: GeminiConfigSchema
  });
  const middleware = [];
  if (SUPPORTED_V1_MODELS[name]) {
    middleware.push((0, import_middleware.simulateSystemPrompt)());
  }
  if (model.info?.supports?.media) {
    middleware.push(
      (0, import_middleware.downloadRequestMedia)({
        maxBytes: 1024 * 1024 * 10,
        // don't downlaod files that have been uploaded using the Files API
        filter: (part) => {
          try {
            const url = new URL(part.media.url);
            if (
              // Gemini can handle these URLs
              [
                "generativelanguage.googleapis.com",
                "www.youtube.com",
                "youtube.com",
                "youtu.be"
              ].includes(url.hostname)
            )
              return false;
          } catch {
          }
          return true;
        }
      })
    );
  }
  return ai.defineModel(
    {
      name: model.name,
      ...model.info,
      configSchema: model.configSchema,
      use: middleware
    },
    async (request, sendChunk) => {
      const options = { apiClient: import_genkit.GENKIT_CLIENT_HEADER };
      if (apiVersion) {
        options.apiVersion = apiVersion;
      }
      if (apiVersion) {
        options.baseUrl = baseUrl;
      }
      const requestConfig = {
        ...defaultConfig,
        ...request.config
      };
      const messages = [...request.messages];
      if (messages.length === 0) throw new Error("No messages provided.");
      let systemInstruction = void 0;
      if (SUPPORTED_V15_MODELS[name]) {
        const systemMessage = messages.find((m) => m.role === "system");
        if (systemMessage) {
          messages.splice(messages.indexOf(systemMessage), 1);
          systemInstruction = toGeminiSystemInstruction(systemMessage);
        }
      }
      const tools = [];
      if (request.tools?.length) {
        tools.push({
          functionDeclarations: request.tools.map(toGeminiTool)
        });
      }
      if (requestConfig.codeExecution) {
        tools.push({
          codeExecution: request.config.codeExecution === true ? {} : request.config.codeExecution
        });
      }
      let toolConfig;
      if (requestConfig.functionCallingConfig) {
        toolConfig = {
          functionCallingConfig: {
            allowedFunctionNames: requestConfig.functionCallingConfig.allowedFunctionNames,
            mode: toFunctionModeEnum(requestConfig.functionCallingConfig.mode)
          }
        };
      } else if (request.toolChoice) {
        toolConfig = {
          functionCallingConfig: {
            mode: toGeminiFunctionModeEnum(request.toolChoice)
          }
        };
      }
      const jsonMode = request.output?.format === "json" || request.output?.contentType === "application/json" && tools.length === 0;
      const generationConfig = {
        candidateCount: request.candidates || void 0,
        temperature: requestConfig.temperature,
        maxOutputTokens: requestConfig.maxOutputTokens,
        topK: requestConfig.topK,
        topP: requestConfig.topP,
        stopSequences: requestConfig.stopSequences,
        responseMimeType: jsonMode ? "application/json" : void 0
      };
      if (requestConfig.responseModalities) {
        generationConfig.responseModalities = requestConfig.responseModalities;
      }
      if (request.output?.constrained && jsonMode) {
        generationConfig.responseSchema = cleanSchema(request.output.schema);
      }
      const msg = toGeminiMessage(messages[messages.length - 1], model);
      const fromJSONModeScopedGeminiCandidate = (candidate) => {
        return fromGeminiCandidate(candidate, jsonMode);
      };
      let chatRequest = {
        systemInstruction,
        generationConfig,
        tools: tools.length ? tools : void 0,
        toolConfig,
        history: messages.slice(0, -1).map((message) => toGeminiMessage(message, model)),
        safetySettings: requestConfig.safetySettings
      };
      const modelVersion = request.config?.version || model.version || name;
      const cacheConfigDetails = (0, import_utils.extractCacheConfig)(request);
      const { chatRequest: updatedChatRequest, cache } = await (0, import_context_caching.handleCacheIfNeeded)(
        apiKey,
        request,
        chatRequest,
        modelVersion,
        cacheConfigDetails
      );
      if (!requestConfig.apiKey && !apiKey) {
        throw new import_genkit.GenkitError({
          status: "INVALID_ARGUMENT",
          message: "GoogleAI plugin was initialized with {apiKey: false} but no apiKey configuration was passed at call time."
        });
      }
      const client = new import_generative_ai.GoogleGenerativeAI(requestConfig.apiKey || apiKey);
      let genModel;
      if (cache) {
        genModel = client.getGenerativeModelFromCachedContent(
          cache,
          {
            model: modelVersion
          },
          options
        );
      } else {
        genModel = client.getGenerativeModel(
          {
            model: modelVersion
          },
          options
        );
      }
      const callGemini = async () => {
        let response;
        if (sendChunk) {
          const result = await genModel.startChat(updatedChatRequest).sendMessageStream(msg.parts, options);
          for await (const item of result.stream) {
            item.candidates?.forEach(
              (candidate) => {
                const c = fromJSONModeScopedGeminiCandidate(candidate);
                sendChunk({
                  index: c.index,
                  content: c.message.content
                });
              }
            );
          }
          response = await result.response;
        } else {
          const result = await genModel.startChat(updatedChatRequest).sendMessage(msg.parts, options);
          response = result.response;
        }
        const candidates = response.candidates || [];
        if (response.candidates?.["undefined"]) {
          candidates.push(response.candidates["undefined"]);
        }
        if (!candidates.length) {
          throw new import_genkit.GenkitError({
            status: "FAILED_PRECONDITION",
            message: "No valid candidates returned."
          });
        }
        const candidateData = candidates.map(fromJSONModeScopedGeminiCandidate) || [];
        return {
          candidates: candidateData,
          custom: response,
          usage: {
            ...(0, import_model.getBasicUsageStats)(request.messages, candidateData),
            inputTokens: response.usageMetadata?.promptTokenCount,
            outputTokens: response.usageMetadata?.candidatesTokenCount,
            totalTokens: response.usageMetadata?.totalTokenCount
          }
        };
      };
      return debugTraces ? await (0, import_tracing.runInNewSpan)(
        ai.registry,
        {
          metadata: {
            name: sendChunk ? "sendMessageStream" : "sendMessage"
          }
        },
        async (metadata) => {
          metadata.input = {
            sdk: "@google/generative-ai",
            cache,
            model: genModel.model,
            chatOptions: updatedChatRequest,
            parts: msg.parts,
            options
          };
          const response = await callGemini();
          metadata.output = response.custom;
          return response;
        }
      ) : await callGemini();
    }
  );
}
function toFunctionModeEnum(configEnum) {
  if (configEnum === void 0) {
    return void 0;
  }
  switch (configEnum) {
    case "MODE_UNSPECIFIED": {
      return import_generative_ai.FunctionCallingMode.MODE_UNSPECIFIED;
    }
    case "ANY": {
      return import_generative_ai.FunctionCallingMode.ANY;
    }
    case "AUTO": {
      return import_generative_ai.FunctionCallingMode.AUTO;
    }
    case "NONE": {
      return import_generative_ai.FunctionCallingMode.NONE;
    }
    default:
      throw new Error(`unsupported function calling mode: ${configEnum}`);
  }
}
function toGeminiFunctionModeEnum(genkitMode) {
  if (genkitMode === void 0) {
    return void 0;
  }
  switch (genkitMode) {
    case "required": {
      return import_generative_ai.FunctionCallingMode.ANY;
    }
    case "auto": {
      return import_generative_ai.FunctionCallingMode.AUTO;
    }
    case "none": {
      return import_generative_ai.FunctionCallingMode.NONE;
    }
    default:
      throw new Error(`unsupported function calling mode: ${genkitMode}`);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GENERIC_GEMINI_MODEL,
  GeminiConfigSchema,
  SUPPORTED_GEMINI_MODELS,
  SUPPORTED_V15_MODELS,
  SUPPORTED_V1_MODELS,
  cleanSchema,
  defineGoogleAIModel,
  fromGeminiCandidate,
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
  toGeminiMessage,
  toGeminiSystemInstruction,
  toGeminiTool
});
//# sourceMappingURL=gemini.js.map