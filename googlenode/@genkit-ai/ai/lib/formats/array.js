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
var array_exports = {};
__export(array_exports, {
  arrayFormatter: () => arrayFormatter
});
module.exports = __toCommonJS(array_exports);
var import_core = require("@genkit-ai/core");
var import_extract = require("../extract");
const arrayFormatter = {
  name: "array",
  config: {
    contentType: "application/json",
    constrained: true
  },
  handler: (schema) => {
    if (schema && schema.type !== "array") {
      throw new import_core.GenkitError({
        status: "INVALID_ARGUMENT",
        message: `Must supply an 'array' schema type when using the 'items' parser format.`
      });
    }
    let instructions;
    if (schema) {
      instructions = `Output should be a JSON array conforming to the following schema:
    
\`\`\`
${JSON.stringify(schema)}
\`\`\`
    `;
    }
    return {
      parseChunk: (chunk) => {
        const cursor = chunk.previousChunks?.length ? (0, import_extract.extractItems)(chunk.previousText).cursor : 0;
        const { items } = (0, import_extract.extractItems)(chunk.accumulatedText, cursor);
        return items;
      },
      parseMessage: (message) => {
        const { items } = (0, import_extract.extractItems)(message.text, 0);
        return items;
      },
      instructions
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  arrayFormatter
});
//# sourceMappingURL=array.js.map