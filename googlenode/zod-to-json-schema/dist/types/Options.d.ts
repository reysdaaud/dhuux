import { ZodSchema, ZodTypeDef } from "zod";
import { Refs, Seen } from "./Refs";
import { JsonSchema7Type } from "./parseDef";
export type Targets = "jsonSchema7" | "jsonSchema2019-09" | "openApi3" | "openAi";
export type DateStrategy = "format:date-time" | "format:date" | "string" | "integer";
export declare const ignoreOverride: unique symbol;
export type Options<Target extends Targets = "jsonSchema7"> = {
    name: string | undefined;
    $refStrategy: "root" | "relative" | "none" | "seen";
    basePath: string[];
    effectStrategy: "input" | "any";
    pipeStrategy: "input" | "output" | "all";
    dateStrategy: DateStrategy | DateStrategy[];
    mapStrategy: "entries" | "record";
    removeAdditionalStrategy: "passthrough" | "strict";
    target: Target;
    strictUnions: boolean;
    definitionPath: string;
    definitions: Record<string, ZodSchema>;
    errorMessages: boolean;
    markdownDescription: boolean;
    patternStrategy: "escape" | "preserve";
    applyRegexFlags: boolean;
    emailStrategy: "format:email" | "format:idn-email" | "pattern:zod";
    base64Strategy: "format:binary" | "contentEncoding:base64" | "pattern:zod";
    nameStrategy: "ref" | "title";
    override?: (def: ZodTypeDef, refs: Refs, seen: Seen | undefined, forceResolution?: boolean) => JsonSchema7Type | undefined | typeof ignoreOverride;
};
export declare const defaultOptions: Options;
export declare const getDefaultOptions: <Target extends Targets>(options: string | Partial<Options<Target>> | undefined) => Options<Target>;
