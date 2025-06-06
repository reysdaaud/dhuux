import { z } from 'zod';
export declare const EVAL_FIELDS: readonly ["input", "output", "context"];
export type EvalField = (typeof EVAL_FIELDS)[number];
declare const InputSelectorSchema: z.ZodObject<{
    inputOf: z.ZodString;
}, "strip", z.ZodTypeAny, {
    inputOf: string;
}, {
    inputOf: string;
}>;
export type InputStepSelector = z.infer<typeof InputSelectorSchema>;
declare const OutputSelectorSchema: z.ZodObject<{
    outputOf: z.ZodString;
}, "strip", z.ZodTypeAny, {
    outputOf: string;
}, {
    outputOf: string;
}>;
export type OutputStepSelector = z.infer<typeof OutputSelectorSchema>;
declare const StepSelectorSchema: z.ZodUnion<[z.ZodObject<{
    inputOf: z.ZodString;
}, "strip", z.ZodTypeAny, {
    inputOf: string;
}, {
    inputOf: string;
}>, z.ZodObject<{
    outputOf: z.ZodString;
}, "strip", z.ZodTypeAny, {
    outputOf: string;
}, {
    outputOf: string;
}>]>;
export type StepSelector = z.infer<typeof StepSelectorSchema>;
declare const EvaluationExtractorSchema: z.ZodRecord<z.ZodEnum<["input", "output", "context"]>, z.ZodUnion<[z.ZodString, z.ZodUnion<[z.ZodObject<{
    inputOf: z.ZodString;
}, "strip", z.ZodTypeAny, {
    inputOf: string;
}, {
    inputOf: string;
}>, z.ZodObject<{
    outputOf: z.ZodString;
}, "strip", z.ZodTypeAny, {
    outputOf: string;
}, {
    outputOf: string;
}>]>, z.ZodFunction<z.ZodTuple<[z.ZodObject<{
    traceId: z.ZodString;
    displayName: z.ZodOptional<z.ZodString>;
    startTime: z.ZodOptional<z.ZodNumber>;
    endTime: z.ZodOptional<z.ZodNumber>;
    spans: z.ZodRecord<z.ZodString, z.ZodObject<{
        spanId: z.ZodString;
        traceId: z.ZodString;
        parentSpanId: z.ZodOptional<z.ZodString>;
        startTime: z.ZodNumber;
        endTime: z.ZodNumber;
        attributes: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        displayName: z.ZodString;
        links: z.ZodOptional<z.ZodArray<z.ZodObject<{
            context: z.ZodOptional<z.ZodObject<{
                traceId: z.ZodString;
                spanId: z.ZodString;
                isRemote: z.ZodOptional<z.ZodBoolean>;
                traceFlags: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                traceId: string;
                spanId: string;
                traceFlags: number;
                isRemote?: boolean | undefined;
            }, {
                traceId: string;
                spanId: string;
                traceFlags: number;
                isRemote?: boolean | undefined;
            }>>;
            attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            droppedAttributesCount: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            context?: {
                traceId: string;
                spanId: string;
                traceFlags: number;
                isRemote?: boolean | undefined;
            } | undefined;
            attributes?: Record<string, unknown> | undefined;
            droppedAttributesCount?: number | undefined;
        }, {
            context?: {
                traceId: string;
                spanId: string;
                traceFlags: number;
                isRemote?: boolean | undefined;
            } | undefined;
            attributes?: Record<string, unknown> | undefined;
            droppedAttributesCount?: number | undefined;
        }>, "many">>;
        instrumentationLibrary: z.ZodObject<{
            name: z.ZodReadonly<z.ZodString>;
            version: z.ZodReadonly<z.ZodOptional<z.ZodString>>;
            schemaUrl: z.ZodReadonly<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            version?: string | undefined;
            schemaUrl?: string | undefined;
        }, {
            name: string;
            version?: string | undefined;
            schemaUrl?: string | undefined;
        }>;
        spanKind: z.ZodString;
        sameProcessAsParentSpan: z.ZodOptional<z.ZodObject<{
            value: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            value: boolean;
        }, {
            value: boolean;
        }>>;
        status: z.ZodOptional<z.ZodObject<{
            code: z.ZodNumber;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            code: number;
            message?: string | undefined;
        }, {
            code: number;
            message?: string | undefined;
        }>>;
        timeEvents: z.ZodOptional<z.ZodObject<{
            timeEvent: z.ZodOptional<z.ZodArray<z.ZodObject<{
                time: z.ZodNumber;
                annotation: z.ZodObject<{
                    attributes: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                    description: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    description: string;
                    attributes: Record<string, unknown>;
                }, {
                    description: string;
                    attributes: Record<string, unknown>;
                }>;
            }, "strip", z.ZodTypeAny, {
                time: number;
                annotation: {
                    description: string;
                    attributes: Record<string, unknown>;
                };
            }, {
                time: number;
                annotation: {
                    description: string;
                    attributes: Record<string, unknown>;
                };
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            timeEvent?: {
                time: number;
                annotation: {
                    description: string;
                    attributes: Record<string, unknown>;
                };
            }[] | undefined;
        }, {
            timeEvent?: {
                time: number;
                annotation: {
                    description: string;
                    attributes: Record<string, unknown>;
                };
            }[] | undefined;
        }>>;
        truncated: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        traceId: string;
        spanId: string;
        displayName: string;
        attributes: Record<string, unknown>;
        startTime: number;
        endTime: number;
        instrumentationLibrary: {
            name: string;
            version?: string | undefined;
            schemaUrl?: string | undefined;
        };
        spanKind: string;
        status?: {
            code: number;
            message?: string | undefined;
        } | undefined;
        parentSpanId?: string | undefined;
        links?: {
            context?: {
                traceId: string;
                spanId: string;
                traceFlags: number;
                isRemote?: boolean | undefined;
            } | undefined;
            attributes?: Record<string, unknown> | undefined;
            droppedAttributesCount?: number | undefined;
        }[] | undefined;
        sameProcessAsParentSpan?: {
            value: boolean;
        } | undefined;
        timeEvents?: {
            timeEvent?: {
                time: number;
                annotation: {
                    description: string;
                    attributes: Record<string, unknown>;
                };
            }[] | undefined;
        } | undefined;
        truncated?: boolean | undefined;
    }, {
        traceId: string;
        spanId: string;
        displayName: string;
        attributes: Record<string, unknown>;
        startTime: number;
        endTime: number;
        instrumentationLibrary: {
            name: string;
            version?: string | undefined;
            schemaUrl?: string | undefined;
        };
        spanKind: string;
        status?: {
            code: number;
            message?: string | undefined;
        } | undefined;
        parentSpanId?: string | undefined;
        links?: {
            context?: {
                traceId: string;
                spanId: string;
                traceFlags: number;
                isRemote?: boolean | undefined;
            } | undefined;
            attributes?: Record<string, unknown> | undefined;
            droppedAttributesCount?: number | undefined;
        }[] | undefined;
        sameProcessAsParentSpan?: {
            value: boolean;
        } | undefined;
        timeEvents?: {
            timeEvent?: {
                time: number;
                annotation: {
                    description: string;
                    attributes: Record<string, unknown>;
                };
            }[] | undefined;
        } | undefined;
        truncated?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    traceId: string;
    spans: Record<string, {
        traceId: string;
        spanId: string;
        displayName: string;
        attributes: Record<string, unknown>;
        startTime: number;
        endTime: number;
        instrumentationLibrary: {
            name: string;
            version?: string | undefined;
            schemaUrl?: string | undefined;
        };
        spanKind: string;
        status?: {
            code: number;
            message?: string | undefined;
        } | undefined;
        parentSpanId?: string | undefined;
        links?: {
            context?: {
                traceId: string;
                spanId: string;
                traceFlags: number;
                isRemote?: boolean | undefined;
            } | undefined;
            attributes?: Record<string, unknown> | undefined;
            droppedAttributesCount?: number | undefined;
        }[] | undefined;
        sameProcessAsParentSpan?: {
            value: boolean;
        } | undefined;
        timeEvents?: {
            timeEvent?: {
                time: number;
                annotation: {
                    description: string;
                    attributes: Record<string, unknown>;
                };
            }[] | undefined;
        } | undefined;
        truncated?: boolean | undefined;
    }>;
    displayName?: string | undefined;
    startTime?: number | undefined;
    endTime?: number | undefined;
}, {
    traceId: string;
    spans: Record<string, {
        traceId: string;
        spanId: string;
        displayName: string;
        attributes: Record<string, unknown>;
        startTime: number;
        endTime: number;
        instrumentationLibrary: {
            name: string;
            version?: string | undefined;
            schemaUrl?: string | undefined;
        };
        spanKind: string;
        status?: {
            code: number;
            message?: string | undefined;
        } | undefined;
        parentSpanId?: string | undefined;
        links?: {
            context?: {
                traceId: string;
                spanId: string;
                traceFlags: number;
                isRemote?: boolean | undefined;
            } | undefined;
            attributes?: Record<string, unknown> | undefined;
            droppedAttributesCount?: number | undefined;
        }[] | undefined;
        sameProcessAsParentSpan?: {
            value: boolean;
        } | undefined;
        timeEvents?: {
            timeEvent?: {
                time: number;
                annotation: {
                    description: string;
                    attributes: Record<string, unknown>;
                };
            }[] | undefined;
        } | undefined;
        truncated?: boolean | undefined;
    }>;
    displayName?: string | undefined;
    startTime?: number | undefined;
    endTime?: number | undefined;
}>], z.ZodUnknown>, z.ZodAny>]>>;
export type EvaluationExtractor = z.infer<typeof EvaluationExtractorSchema>;
export declare function isEvalField(input: string): input is EvalField;
declare const ToolsConfigSchema: z.ZodObject<{
    cliPlugins: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        keyword: z.ZodString;
        actions: z.ZodArray<z.ZodObject<z.objectUtil.extendShape<{
            args: z.ZodOptional<z.ZodArray<z.ZodObject<{
                description: z.ZodString;
                flag: z.ZodString;
                defaultValue: z.ZodUnion<[z.ZodUndefined, z.ZodString, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>;
            }, "strip", z.ZodTypeAny, {
                description: string;
                flag: string;
                defaultValue?: string | boolean | string[] | undefined;
            }, {
                description: string;
                flag: string;
                defaultValue?: string | boolean | string[] | undefined;
            }>, "many">>;
            hook: z.ZodFunction<z.ZodTuple<[z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodUndefined, z.ZodString, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>>], z.ZodUnknown>, z.ZodUnion<[z.ZodVoid, z.ZodPromise<z.ZodVoid>]>>;
        }, {
            action: z.ZodString;
            helpText: z.ZodString;
        }>, "strip", z.ZodTypeAny, {
            hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
            action: string;
            helpText: string;
            args?: {
                description: string;
                flag: string;
                defaultValue?: string | boolean | string[] | undefined;
            }[] | undefined;
        }, {
            hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
            action: string;
            helpText: string;
            args?: {
                description: string;
                flag: string;
                defaultValue?: string | boolean | string[] | undefined;
            }[] | undefined;
        }>, "many">;
        subCommands: z.ZodOptional<z.ZodObject<{
            login: z.ZodOptional<z.ZodObject<{
                args: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    description: z.ZodString;
                    flag: z.ZodString;
                    defaultValue: z.ZodUnion<[z.ZodUndefined, z.ZodString, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>;
                }, "strip", z.ZodTypeAny, {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }, {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }>, "many">>;
                hook: z.ZodFunction<z.ZodTuple<[z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodUndefined, z.ZodString, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>>], z.ZodUnknown>, z.ZodUnion<[z.ZodVoid, z.ZodPromise<z.ZodVoid>]>>;
            }, "strip", z.ZodTypeAny, {
                hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
                args?: {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }[] | undefined;
            }, {
                hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
                args?: {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }[] | undefined;
            }>>;
            deploy: z.ZodOptional<z.ZodObject<{
                args: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    description: z.ZodString;
                    flag: z.ZodString;
                    defaultValue: z.ZodUnion<[z.ZodUndefined, z.ZodString, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>;
                }, "strip", z.ZodTypeAny, {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }, {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }>, "many">>;
                hook: z.ZodFunction<z.ZodTuple<[z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodUndefined, z.ZodString, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>>], z.ZodUnknown>, z.ZodUnion<[z.ZodVoid, z.ZodPromise<z.ZodVoid>]>>;
            }, "strip", z.ZodTypeAny, {
                hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
                args?: {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }[] | undefined;
            }, {
                hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
                args?: {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }[] | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            login?: {
                hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
                args?: {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }[] | undefined;
            } | undefined;
            deploy?: {
                hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
                args?: {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }[] | undefined;
            } | undefined;
        }, {
            login?: {
                hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
                args?: {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }[] | undefined;
            } | undefined;
            deploy?: {
                hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
                args?: {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }[] | undefined;
            } | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        keyword: string;
        actions: {
            hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
            action: string;
            helpText: string;
            args?: {
                description: string;
                flag: string;
                defaultValue?: string | boolean | string[] | undefined;
            }[] | undefined;
        }[];
        subCommands?: {
            login?: {
                hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
                args?: {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }[] | undefined;
            } | undefined;
            deploy?: {
                hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
                args?: {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }[] | undefined;
            } | undefined;
        } | undefined;
    }, {
        name: string;
        keyword: string;
        actions: {
            hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
            action: string;
            helpText: string;
            args?: {
                description: string;
                flag: string;
                defaultValue?: string | boolean | string[] | undefined;
            }[] | undefined;
        }[];
        subCommands?: {
            login?: {
                hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
                args?: {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }[] | undefined;
            } | undefined;
            deploy?: {
                hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
                args?: {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }[] | undefined;
            } | undefined;
        } | undefined;
    }>, "many">>;
    builder: z.ZodOptional<z.ZodObject<{
        cmd: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        cmd?: string | undefined;
    }, {
        cmd?: string | undefined;
    }>>;
    evaluators: z.ZodOptional<z.ZodArray<z.ZodObject<{
        actionRef: z.ZodOptional<z.ZodString>;
        extractors: z.ZodRecord<z.ZodEnum<["input", "output", "context"]>, z.ZodUnion<[z.ZodString, z.ZodUnion<[z.ZodObject<{
            inputOf: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            inputOf: string;
        }, {
            inputOf: string;
        }>, z.ZodObject<{
            outputOf: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            outputOf: string;
        }, {
            outputOf: string;
        }>]>, z.ZodFunction<z.ZodTuple<[z.ZodObject<{
            traceId: z.ZodString;
            displayName: z.ZodOptional<z.ZodString>;
            startTime: z.ZodOptional<z.ZodNumber>;
            endTime: z.ZodOptional<z.ZodNumber>;
            spans: z.ZodRecord<z.ZodString, z.ZodObject<{
                spanId: z.ZodString;
                traceId: z.ZodString;
                parentSpanId: z.ZodOptional<z.ZodString>;
                startTime: z.ZodNumber;
                endTime: z.ZodNumber;
                attributes: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                displayName: z.ZodString;
                links: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    context: z.ZodOptional<z.ZodObject<{
                        traceId: z.ZodString;
                        spanId: z.ZodString;
                        isRemote: z.ZodOptional<z.ZodBoolean>;
                        traceFlags: z.ZodNumber;
                    }, "strip", z.ZodTypeAny, {
                        traceId: string;
                        spanId: string;
                        traceFlags: number;
                        isRemote?: boolean | undefined;
                    }, {
                        traceId: string;
                        spanId: string;
                        traceFlags: number;
                        isRemote?: boolean | undefined;
                    }>>;
                    attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                    droppedAttributesCount: z.ZodOptional<z.ZodNumber>;
                }, "strip", z.ZodTypeAny, {
                    context?: {
                        traceId: string;
                        spanId: string;
                        traceFlags: number;
                        isRemote?: boolean | undefined;
                    } | undefined;
                    attributes?: Record<string, unknown> | undefined;
                    droppedAttributesCount?: number | undefined;
                }, {
                    context?: {
                        traceId: string;
                        spanId: string;
                        traceFlags: number;
                        isRemote?: boolean | undefined;
                    } | undefined;
                    attributes?: Record<string, unknown> | undefined;
                    droppedAttributesCount?: number | undefined;
                }>, "many">>;
                instrumentationLibrary: z.ZodObject<{
                    name: z.ZodReadonly<z.ZodString>;
                    version: z.ZodReadonly<z.ZodOptional<z.ZodString>>;
                    schemaUrl: z.ZodReadonly<z.ZodOptional<z.ZodString>>;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    version?: string | undefined;
                    schemaUrl?: string | undefined;
                }, {
                    name: string;
                    version?: string | undefined;
                    schemaUrl?: string | undefined;
                }>;
                spanKind: z.ZodString;
                sameProcessAsParentSpan: z.ZodOptional<z.ZodObject<{
                    value: z.ZodBoolean;
                }, "strip", z.ZodTypeAny, {
                    value: boolean;
                }, {
                    value: boolean;
                }>>;
                status: z.ZodOptional<z.ZodObject<{
                    code: z.ZodNumber;
                    message: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    code: number;
                    message?: string | undefined;
                }, {
                    code: number;
                    message?: string | undefined;
                }>>;
                timeEvents: z.ZodOptional<z.ZodObject<{
                    timeEvent: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        time: z.ZodNumber;
                        annotation: z.ZodObject<{
                            attributes: z.ZodRecord<z.ZodString, z.ZodUnknown>;
                            description: z.ZodString;
                        }, "strip", z.ZodTypeAny, {
                            description: string;
                            attributes: Record<string, unknown>;
                        }, {
                            description: string;
                            attributes: Record<string, unknown>;
                        }>;
                    }, "strip", z.ZodTypeAny, {
                        time: number;
                        annotation: {
                            description: string;
                            attributes: Record<string, unknown>;
                        };
                    }, {
                        time: number;
                        annotation: {
                            description: string;
                            attributes: Record<string, unknown>;
                        };
                    }>, "many">>;
                }, "strip", z.ZodTypeAny, {
                    timeEvent?: {
                        time: number;
                        annotation: {
                            description: string;
                            attributes: Record<string, unknown>;
                        };
                    }[] | undefined;
                }, {
                    timeEvent?: {
                        time: number;
                        annotation: {
                            description: string;
                            attributes: Record<string, unknown>;
                        };
                    }[] | undefined;
                }>>;
                truncated: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                traceId: string;
                spanId: string;
                displayName: string;
                attributes: Record<string, unknown>;
                startTime: number;
                endTime: number;
                instrumentationLibrary: {
                    name: string;
                    version?: string | undefined;
                    schemaUrl?: string | undefined;
                };
                spanKind: string;
                status?: {
                    code: number;
                    message?: string | undefined;
                } | undefined;
                parentSpanId?: string | undefined;
                links?: {
                    context?: {
                        traceId: string;
                        spanId: string;
                        traceFlags: number;
                        isRemote?: boolean | undefined;
                    } | undefined;
                    attributes?: Record<string, unknown> | undefined;
                    droppedAttributesCount?: number | undefined;
                }[] | undefined;
                sameProcessAsParentSpan?: {
                    value: boolean;
                } | undefined;
                timeEvents?: {
                    timeEvent?: {
                        time: number;
                        annotation: {
                            description: string;
                            attributes: Record<string, unknown>;
                        };
                    }[] | undefined;
                } | undefined;
                truncated?: boolean | undefined;
            }, {
                traceId: string;
                spanId: string;
                displayName: string;
                attributes: Record<string, unknown>;
                startTime: number;
                endTime: number;
                instrumentationLibrary: {
                    name: string;
                    version?: string | undefined;
                    schemaUrl?: string | undefined;
                };
                spanKind: string;
                status?: {
                    code: number;
                    message?: string | undefined;
                } | undefined;
                parentSpanId?: string | undefined;
                links?: {
                    context?: {
                        traceId: string;
                        spanId: string;
                        traceFlags: number;
                        isRemote?: boolean | undefined;
                    } | undefined;
                    attributes?: Record<string, unknown> | undefined;
                    droppedAttributesCount?: number | undefined;
                }[] | undefined;
                sameProcessAsParentSpan?: {
                    value: boolean;
                } | undefined;
                timeEvents?: {
                    timeEvent?: {
                        time: number;
                        annotation: {
                            description: string;
                            attributes: Record<string, unknown>;
                        };
                    }[] | undefined;
                } | undefined;
                truncated?: boolean | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            traceId: string;
            spans: Record<string, {
                traceId: string;
                spanId: string;
                displayName: string;
                attributes: Record<string, unknown>;
                startTime: number;
                endTime: number;
                instrumentationLibrary: {
                    name: string;
                    version?: string | undefined;
                    schemaUrl?: string | undefined;
                };
                spanKind: string;
                status?: {
                    code: number;
                    message?: string | undefined;
                } | undefined;
                parentSpanId?: string | undefined;
                links?: {
                    context?: {
                        traceId: string;
                        spanId: string;
                        traceFlags: number;
                        isRemote?: boolean | undefined;
                    } | undefined;
                    attributes?: Record<string, unknown> | undefined;
                    droppedAttributesCount?: number | undefined;
                }[] | undefined;
                sameProcessAsParentSpan?: {
                    value: boolean;
                } | undefined;
                timeEvents?: {
                    timeEvent?: {
                        time: number;
                        annotation: {
                            description: string;
                            attributes: Record<string, unknown>;
                        };
                    }[] | undefined;
                } | undefined;
                truncated?: boolean | undefined;
            }>;
            displayName?: string | undefined;
            startTime?: number | undefined;
            endTime?: number | undefined;
        }, {
            traceId: string;
            spans: Record<string, {
                traceId: string;
                spanId: string;
                displayName: string;
                attributes: Record<string, unknown>;
                startTime: number;
                endTime: number;
                instrumentationLibrary: {
                    name: string;
                    version?: string | undefined;
                    schemaUrl?: string | undefined;
                };
                spanKind: string;
                status?: {
                    code: number;
                    message?: string | undefined;
                } | undefined;
                parentSpanId?: string | undefined;
                links?: {
                    context?: {
                        traceId: string;
                        spanId: string;
                        traceFlags: number;
                        isRemote?: boolean | undefined;
                    } | undefined;
                    attributes?: Record<string, unknown> | undefined;
                    droppedAttributesCount?: number | undefined;
                }[] | undefined;
                sameProcessAsParentSpan?: {
                    value: boolean;
                } | undefined;
                timeEvents?: {
                    timeEvent?: {
                        time: number;
                        annotation: {
                            description: string;
                            attributes: Record<string, unknown>;
                        };
                    }[] | undefined;
                } | undefined;
                truncated?: boolean | undefined;
            }>;
            displayName?: string | undefined;
            startTime?: number | undefined;
            endTime?: number | undefined;
        }>], z.ZodUnknown>, z.ZodAny>]>>;
    }, "strip", z.ZodTypeAny, {
        extractors: Partial<Record<"input" | "output" | "context", string | {
            inputOf: string;
        } | {
            outputOf: string;
        } | ((args_0: {
            traceId: string;
            spans: Record<string, {
                traceId: string;
                spanId: string;
                displayName: string;
                attributes: Record<string, unknown>;
                startTime: number;
                endTime: number;
                instrumentationLibrary: {
                    name: string;
                    version?: string | undefined;
                    schemaUrl?: string | undefined;
                };
                spanKind: string;
                status?: {
                    code: number;
                    message?: string | undefined;
                } | undefined;
                parentSpanId?: string | undefined;
                links?: {
                    context?: {
                        traceId: string;
                        spanId: string;
                        traceFlags: number;
                        isRemote?: boolean | undefined;
                    } | undefined;
                    attributes?: Record<string, unknown> | undefined;
                    droppedAttributesCount?: number | undefined;
                }[] | undefined;
                sameProcessAsParentSpan?: {
                    value: boolean;
                } | undefined;
                timeEvents?: {
                    timeEvent?: {
                        time: number;
                        annotation: {
                            description: string;
                            attributes: Record<string, unknown>;
                        };
                    }[] | undefined;
                } | undefined;
                truncated?: boolean | undefined;
            }>;
            displayName?: string | undefined;
            startTime?: number | undefined;
            endTime?: number | undefined;
        }, ...args_1: unknown[]) => any)>>;
        actionRef?: string | undefined;
    }, {
        extractors: Partial<Record<"input" | "output" | "context", string | {
            inputOf: string;
        } | {
            outputOf: string;
        } | ((args_0: {
            traceId: string;
            spans: Record<string, {
                traceId: string;
                spanId: string;
                displayName: string;
                attributes: Record<string, unknown>;
                startTime: number;
                endTime: number;
                instrumentationLibrary: {
                    name: string;
                    version?: string | undefined;
                    schemaUrl?: string | undefined;
                };
                spanKind: string;
                status?: {
                    code: number;
                    message?: string | undefined;
                } | undefined;
                parentSpanId?: string | undefined;
                links?: {
                    context?: {
                        traceId: string;
                        spanId: string;
                        traceFlags: number;
                        isRemote?: boolean | undefined;
                    } | undefined;
                    attributes?: Record<string, unknown> | undefined;
                    droppedAttributesCount?: number | undefined;
                }[] | undefined;
                sameProcessAsParentSpan?: {
                    value: boolean;
                } | undefined;
                timeEvents?: {
                    timeEvent?: {
                        time: number;
                        annotation: {
                            description: string;
                            attributes: Record<string, unknown>;
                        };
                    }[] | undefined;
                } | undefined;
                truncated?: boolean | undefined;
            }>;
            displayName?: string | undefined;
            startTime?: number | undefined;
            endTime?: number | undefined;
        }, ...args_1: unknown[]) => any)>>;
        actionRef?: string | undefined;
    }>, "many">>;
    runner: z.ZodOptional<z.ZodObject<{
        mode: z.ZodDefault<z.ZodEnum<["default", "harness"]>>;
        files: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        mode: "default" | "harness";
        files?: string[] | undefined;
    }, {
        mode?: "default" | "harness" | undefined;
        files?: string[] | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    evaluators?: {
        extractors: Partial<Record<"input" | "output" | "context", string | {
            inputOf: string;
        } | {
            outputOf: string;
        } | ((args_0: {
            traceId: string;
            spans: Record<string, {
                traceId: string;
                spanId: string;
                displayName: string;
                attributes: Record<string, unknown>;
                startTime: number;
                endTime: number;
                instrumentationLibrary: {
                    name: string;
                    version?: string | undefined;
                    schemaUrl?: string | undefined;
                };
                spanKind: string;
                status?: {
                    code: number;
                    message?: string | undefined;
                } | undefined;
                parentSpanId?: string | undefined;
                links?: {
                    context?: {
                        traceId: string;
                        spanId: string;
                        traceFlags: number;
                        isRemote?: boolean | undefined;
                    } | undefined;
                    attributes?: Record<string, unknown> | undefined;
                    droppedAttributesCount?: number | undefined;
                }[] | undefined;
                sameProcessAsParentSpan?: {
                    value: boolean;
                } | undefined;
                timeEvents?: {
                    timeEvent?: {
                        time: number;
                        annotation: {
                            description: string;
                            attributes: Record<string, unknown>;
                        };
                    }[] | undefined;
                } | undefined;
                truncated?: boolean | undefined;
            }>;
            displayName?: string | undefined;
            startTime?: number | undefined;
            endTime?: number | undefined;
        }, ...args_1: unknown[]) => any)>>;
        actionRef?: string | undefined;
    }[] | undefined;
    cliPlugins?: {
        name: string;
        keyword: string;
        actions: {
            hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
            action: string;
            helpText: string;
            args?: {
                description: string;
                flag: string;
                defaultValue?: string | boolean | string[] | undefined;
            }[] | undefined;
        }[];
        subCommands?: {
            login?: {
                hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
                args?: {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }[] | undefined;
            } | undefined;
            deploy?: {
                hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
                args?: {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }[] | undefined;
            } | undefined;
        } | undefined;
    }[] | undefined;
    builder?: {
        cmd?: string | undefined;
    } | undefined;
    runner?: {
        mode: "default" | "harness";
        files?: string[] | undefined;
    } | undefined;
}, {
    evaluators?: {
        extractors: Partial<Record<"input" | "output" | "context", string | {
            inputOf: string;
        } | {
            outputOf: string;
        } | ((args_0: {
            traceId: string;
            spans: Record<string, {
                traceId: string;
                spanId: string;
                displayName: string;
                attributes: Record<string, unknown>;
                startTime: number;
                endTime: number;
                instrumentationLibrary: {
                    name: string;
                    version?: string | undefined;
                    schemaUrl?: string | undefined;
                };
                spanKind: string;
                status?: {
                    code: number;
                    message?: string | undefined;
                } | undefined;
                parentSpanId?: string | undefined;
                links?: {
                    context?: {
                        traceId: string;
                        spanId: string;
                        traceFlags: number;
                        isRemote?: boolean | undefined;
                    } | undefined;
                    attributes?: Record<string, unknown> | undefined;
                    droppedAttributesCount?: number | undefined;
                }[] | undefined;
                sameProcessAsParentSpan?: {
                    value: boolean;
                } | undefined;
                timeEvents?: {
                    timeEvent?: {
                        time: number;
                        annotation: {
                            description: string;
                            attributes: Record<string, unknown>;
                        };
                    }[] | undefined;
                } | undefined;
                truncated?: boolean | undefined;
            }>;
            displayName?: string | undefined;
            startTime?: number | undefined;
            endTime?: number | undefined;
        }, ...args_1: unknown[]) => any)>>;
        actionRef?: string | undefined;
    }[] | undefined;
    cliPlugins?: {
        name: string;
        keyword: string;
        actions: {
            hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
            action: string;
            helpText: string;
            args?: {
                description: string;
                flag: string;
                defaultValue?: string | boolean | string[] | undefined;
            }[] | undefined;
        }[];
        subCommands?: {
            login?: {
                hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
                args?: {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }[] | undefined;
            } | undefined;
            deploy?: {
                hook: (args_0: Record<string, string | boolean | string[] | undefined> | undefined, ...args_1: unknown[]) => void | Promise<void>;
                args?: {
                    description: string;
                    flag: string;
                    defaultValue?: string | boolean | string[] | undefined;
                }[] | undefined;
            } | undefined;
        } | undefined;
    }[] | undefined;
    builder?: {
        cmd?: string | undefined;
    } | undefined;
    runner?: {
        mode?: "default" | "harness" | undefined;
        files?: string[] | undefined;
    } | undefined;
}>;
export type ToolsConfig = z.infer<typeof ToolsConfigSchema>;
export declare function findToolsConfig(): Promise<ToolsConfig | null>;
export declare function genkitToolsConfig(cfg: unknown): ToolsConfig;
export {};
