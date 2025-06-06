"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var jsonl_exports = {};
__export(jsonl_exports, {
  jsonlFormatter: () => jsonlFormatter
});
module.exports = __toCommonJS(jsonl_exports);
var import_core = require("@genkit-ai/core");
var import_json5 = __toESM(require("json5"));
var import_extract = require("../extract");
function objectLines(text) {
  return text.split("\n").map((line) => line.trim()).filter((line) => line.startsWith("{"));
}
const jsonlFormatter = {
  name: "jsonl",
  config: {
    contentType: "application/jsonl"
  },
  handler: (schema) => {
    if (schema && (schema.type !== "array" || schema.items?.type !== "object")) {
      throw new import_core.GenkitError({
        status: "INVALID_ARGUMENT",
        message: `Must supply an 'array' schema type containing 'object' items when using the 'jsonl' parser format.`
      });
    }
    let instructions;
    if (schema?.items) {
      instructions = `Output should be JSONL format, a sequence of JSON objects (one per line) separated by a newline \`\\n\` character. Each line should be a JSON object conforming to the following schema:

\`\`\`
${JSON.stringify(schema.items)}
\`\`\`
    `;
    }
    return {
      parseChunk: (chunk) => {
        const results = [];
        const text = chunk.accumulatedText;
        let startIndex = 0;
        if (chunk.previousChunks?.length) {
          const lastNewline = chunk.previousText.lastIndexOf("\n");
          if (lastNewline !== -1) {
            startIndex = lastNewline + 1;
          }
        }
        const lines = text.slice(startIndex).split("\n");
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("{")) {
            try {
              const result = import_json5.default.parse(trimmed);
              if (result) {
                results.push(result);
              }
            } catch (e) {
              break;
            }
          }
        }
        return results;
      },
      parseMessage: (message) => {
        const items = objectLines(message.text).map((l) => (0, import_extract.extractJson)(l)).filter((l) => !!l);
        return items;
      },
      instructions
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  jsonlFormatter
});
//# sourceMappingURL=jsonl.js.map