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
var types_exports = {};
__export(types_exports, {
  cacheConfigDetailsSchema: () => cacheConfigDetailsSchema,
  cacheConfigSchema: () => cacheConfigSchema
});
module.exports = __toCommonJS(types_exports);
var import_genkit = require("genkit");
const cacheConfigSchema = import_genkit.z.union([
  import_genkit.z.boolean(),
  import_genkit.z.object({ ttlSeconds: import_genkit.z.number().optional() }).passthrough()
]);
const cacheConfigDetailsSchema = import_genkit.z.object({
  cacheConfig: cacheConfigSchema,
  endOfCachedContents: import_genkit.z.number()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cacheConfigDetailsSchema,
  cacheConfigSchema
});
//# sourceMappingURL=types.js.map