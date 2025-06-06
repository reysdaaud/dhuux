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
var json_exports = {};
__export(json_exports, {
  jsonFormatter: () => jsonFormatter
});
module.exports = __toCommonJS(json_exports);
var import_extract = require("../extract");
const jsonFormatter = {
  name: "json",
  config: {
    format: "json",
    contentType: "application/json",
    constrained: true,
    defaultInstructions: false
  },
  handler: (schema) => {
    let instructions;
    if (schema) {
      instructions = `Output should be in JSON format and conform to the following schema:

\`\`\`
${JSON.stringify(schema)}
\`\`\`
`;
    }
    return {
      parseChunk: (chunk) => {
        return (0, import_extract.extractJson)(chunk.accumulatedText);
      },
      parseMessage: (message) => {
        return (0, import_extract.extractJson)(message.text);
      },
      instructions
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  jsonFormatter
});
//# sourceMappingURL=json.js.map