import { extractJson } from "../extract";
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
        return extractJson(chunk.accumulatedText);
      },
      parseMessage: (message) => {
        return extractJson(message.text);
      },
      instructions
    };
  }
};
export {
  jsonFormatter
};
//# sourceMappingURL=json.mjs.map