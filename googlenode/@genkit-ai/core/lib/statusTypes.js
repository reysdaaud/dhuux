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
var statusTypes_exports = {};
__export(statusTypes_exports, {
  StatusCodes: () => StatusCodes,
  StatusNameSchema: () => StatusNameSchema,
  StatusSchema: () => StatusSchema,
  httpStatusCode: () => httpStatusCode
});
module.exports = __toCommonJS(statusTypes_exports);
var z = __toESM(require("zod"));
var StatusCodes = /* @__PURE__ */ ((StatusCodes2) => {
  StatusCodes2[StatusCodes2["OK"] = 0] = "OK";
  StatusCodes2[StatusCodes2["CANCELLED"] = 1] = "CANCELLED";
  StatusCodes2[StatusCodes2["UNKNOWN"] = 2] = "UNKNOWN";
  StatusCodes2[StatusCodes2["INVALID_ARGUMENT"] = 3] = "INVALID_ARGUMENT";
  StatusCodes2[StatusCodes2["DEADLINE_EXCEEDED"] = 4] = "DEADLINE_EXCEEDED";
  StatusCodes2[StatusCodes2["NOT_FOUND"] = 5] = "NOT_FOUND";
  StatusCodes2[StatusCodes2["ALREADY_EXISTS"] = 6] = "ALREADY_EXISTS";
  StatusCodes2[StatusCodes2["PERMISSION_DENIED"] = 7] = "PERMISSION_DENIED";
  StatusCodes2[StatusCodes2["UNAUTHENTICATED"] = 16] = "UNAUTHENTICATED";
  StatusCodes2[StatusCodes2["RESOURCE_EXHAUSTED"] = 8] = "RESOURCE_EXHAUSTED";
  StatusCodes2[StatusCodes2["FAILED_PRECONDITION"] = 9] = "FAILED_PRECONDITION";
  StatusCodes2[StatusCodes2["ABORTED"] = 10] = "ABORTED";
  StatusCodes2[StatusCodes2["OUT_OF_RANGE"] = 11] = "OUT_OF_RANGE";
  StatusCodes2[StatusCodes2["UNIMPLEMENTED"] = 12] = "UNIMPLEMENTED";
  StatusCodes2[StatusCodes2["INTERNAL"] = 13] = "INTERNAL";
  StatusCodes2[StatusCodes2["UNAVAILABLE"] = 14] = "UNAVAILABLE";
  StatusCodes2[StatusCodes2["DATA_LOSS"] = 15] = "DATA_LOSS";
  return StatusCodes2;
})(StatusCodes || {});
const StatusNameSchema = z.enum([
  "OK",
  "CANCELLED",
  "UNKNOWN",
  "INVALID_ARGUMENT",
  "DEADLINE_EXCEEDED",
  "NOT_FOUND",
  "ALREADY_EXISTS",
  "PERMISSION_DENIED",
  "UNAUTHENTICATED",
  "RESOURCE_EXHAUSTED",
  "FAILED_PRECONDITION",
  "ABORTED",
  "OUT_OF_RANGE",
  "UNIMPLEMENTED",
  "INTERNAL",
  "UNAVAILABLE",
  "DATA_LOSS"
]);
const statusCodeMap = {
  OK: 200,
  CANCELLED: 499,
  UNKNOWN: 500,
  INVALID_ARGUMENT: 400,
  DEADLINE_EXCEEDED: 504,
  NOT_FOUND: 404,
  ALREADY_EXISTS: 409,
  PERMISSION_DENIED: 403,
  UNAUTHENTICATED: 401,
  RESOURCE_EXHAUSTED: 429,
  FAILED_PRECONDITION: 400,
  ABORTED: 409,
  OUT_OF_RANGE: 400,
  UNIMPLEMENTED: 501,
  INTERNAL: 500,
  UNAVAILABLE: 503,
  DATA_LOSS: 500
};
function httpStatusCode(status) {
  if (!(status in statusCodeMap)) {
    throw new Error(`Invalid status code ${status}`);
  }
  return statusCodeMap[status];
}
const StatusCodesSchema = z.nativeEnum(StatusCodes);
const StatusSchema = z.object({
  code: StatusCodesSchema,
  message: z.string(),
  details: z.any().optional()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StatusCodes,
  StatusNameSchema,
  StatusSchema,
  httpStatusCode
});
//# sourceMappingURL=statusTypes.js.map