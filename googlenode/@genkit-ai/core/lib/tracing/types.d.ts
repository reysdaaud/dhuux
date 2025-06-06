import { z } from 'zod';

/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

declare const PathMetadataSchema: z.ZodObject<{
    path: z.ZodString;
    status: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
    latency: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    path: string;
    status: string;
    latency: number;
    error?: string | undefined;
}, {
    path: string;
    status: string;
    latency: number;
    error?: string | undefined;
}>;
type PathMetadata = z.infer<typeof PathMetadataSchema>;
declare const TraceMetadataSchema: z.ZodObject<{
    featureName: z.ZodOptional<z.ZodString>;
    paths: z.ZodOptional<z.ZodSet<z.ZodObject<{
        path: z.ZodString;
        status: z.ZodString;
        error: z.ZodOptional<z.ZodString>;
        latency: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        path: string;
        status: string;
        latency: number;
        error?: string | undefined;
    }, {
        path: string;
        status: string;
        latency: number;
        error?: string | undefined;
    }>>>;
    timestamp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    timestamp: number;
    featureName?: string | undefined;
    paths?: Set<{
        path: string;
        status: string;
        latency: number;
        error?: string | undefined;
    }> | undefined;
}, {
    timestamp: number;
    featureName?: string | undefined;
    paths?: Set<{
        path: string;
        status: string;
        latency: number;
        error?: string | undefined;
    }> | undefined;
}>;
type TraceMetadata = z.infer<typeof TraceMetadataSchema>;
declare const SpanMetadataSchema: z.ZodObject<{
    name: z.ZodString;
    state: z.ZodOptional<z.ZodEnum<["success", "error"]>>;
    input: z.ZodOptional<z.ZodAny>;
    output: z.ZodOptional<z.ZodAny>;
    isRoot: z.ZodOptional<z.ZodBoolean>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    path: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    path?: string | undefined;
    state?: "success" | "error" | undefined;
    input?: any;
    output?: any;
    isRoot?: boolean | undefined;
    metadata?: Record<string, string> | undefined;
}, {
    name: string;
    path?: string | undefined;
    state?: "success" | "error" | undefined;
    input?: any;
    output?: any;
    isRoot?: boolean | undefined;
    metadata?: Record<string, string> | undefined;
}>;
type SpanMetadata = z.infer<typeof SpanMetadataSchema>;
declare const SpanStatusSchema: z.ZodObject<{
    code: z.ZodNumber;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: number;
    message?: string | undefined;
}, {
    code: number;
    message?: string | undefined;
}>;
declare const TimeEventSchema: z.ZodObject<{
    time: z.ZodNumber;
    annotation: z.ZodObject<{
        attributes: z.ZodRecord<z.ZodString, z.ZodAny>;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        attributes: Record<string, any>;
        description: string;
    }, {
        attributes: Record<string, any>;
        description: string;
    }>;
}, "strip", z.ZodTypeAny, {
    time: number;
    annotation: {
        attributes: Record<string, any>;
        description: string;
    };
}, {
    time: number;
    annotation: {
        attributes: Record<string, any>;
        description: string;
    };
}>;
declare const SpanContextSchema: z.ZodObject<{
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
}>;
declare const LinkSchema: z.ZodObject<{
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
    attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    droppedAttributesCount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    context?: {
        traceId: string;
        spanId: string;
        traceFlags: number;
        isRemote?: boolean | undefined;
    } | undefined;
    attributes?: Record<string, any> | undefined;
    droppedAttributesCount?: number | undefined;
}, {
    context?: {
        traceId: string;
        spanId: string;
        traceFlags: number;
        isRemote?: boolean | undefined;
    } | undefined;
    attributes?: Record<string, any> | undefined;
    droppedAttributesCount?: number | undefined;
}>;
declare const InstrumentationLibrarySchema: z.ZodObject<{
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
declare const SpanDataSchema: z.ZodObject<{
    spanId: z.ZodString;
    traceId: z.ZodString;
    parentSpanId: z.ZodOptional<z.ZodString>;
    startTime: z.ZodNumber;
    endTime: z.ZodNumber;
    attributes: z.ZodRecord<z.ZodString, z.ZodAny>;
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
        attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        droppedAttributesCount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        context?: {
            traceId: string;
            spanId: string;
            traceFlags: number;
            isRemote?: boolean | undefined;
        } | undefined;
        attributes?: Record<string, any> | undefined;
        droppedAttributesCount?: number | undefined;
    }, {
        context?: {
            traceId: string;
            spanId: string;
            traceFlags: number;
            isRemote?: boolean | undefined;
        } | undefined;
        attributes?: Record<string, any> | undefined;
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
        timeEvent: z.ZodArray<z.ZodObject<{
            time: z.ZodNumber;
            annotation: z.ZodObject<{
                attributes: z.ZodRecord<z.ZodString, z.ZodAny>;
                description: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                attributes: Record<string, any>;
                description: string;
            }, {
                attributes: Record<string, any>;
                description: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            time: number;
            annotation: {
                attributes: Record<string, any>;
                description: string;
            };
        }, {
            time: number;
            annotation: {
                attributes: Record<string, any>;
                description: string;
            };
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        timeEvent: {
            time: number;
            annotation: {
                attributes: Record<string, any>;
                description: string;
            };
        }[];
    }, {
        timeEvent: {
            time: number;
            annotation: {
                attributes: Record<string, any>;
                description: string;
            };
        }[];
    }>>;
    truncated: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    attributes: Record<string, any>;
    traceId: string;
    spanId: string;
    startTime: number;
    endTime: number;
    displayName: string;
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
        attributes?: Record<string, any> | undefined;
        droppedAttributesCount?: number | undefined;
    }[] | undefined;
    sameProcessAsParentSpan?: {
        value: boolean;
    } | undefined;
    timeEvents?: {
        timeEvent: {
            time: number;
            annotation: {
                attributes: Record<string, any>;
                description: string;
            };
        }[];
    } | undefined;
    truncated?: boolean | undefined;
}, {
    attributes: Record<string, any>;
    traceId: string;
    spanId: string;
    startTime: number;
    endTime: number;
    displayName: string;
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
        attributes?: Record<string, any> | undefined;
        droppedAttributesCount?: number | undefined;
    }[] | undefined;
    sameProcessAsParentSpan?: {
        value: boolean;
    } | undefined;
    timeEvents?: {
        timeEvent: {
            time: number;
            annotation: {
                attributes: Record<string, any>;
                description: string;
            };
        }[];
    } | undefined;
    truncated?: boolean | undefined;
}>;
type SpanData = z.infer<typeof SpanDataSchema>;
declare const TraceDataSchema: z.ZodObject<{
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
        attributes: z.ZodRecord<z.ZodString, z.ZodAny>;
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
            attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            droppedAttributesCount: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            context?: {
                traceId: string;
                spanId: string;
                traceFlags: number;
                isRemote?: boolean | undefined;
            } | undefined;
            attributes?: Record<string, any> | undefined;
            droppedAttributesCount?: number | undefined;
        }, {
            context?: {
                traceId: string;
                spanId: string;
                traceFlags: number;
                isRemote?: boolean | undefined;
            } | undefined;
            attributes?: Record<string, any> | undefined;
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
            timeEvent: z.ZodArray<z.ZodObject<{
                time: z.ZodNumber;
                annotation: z.ZodObject<{
                    attributes: z.ZodRecord<z.ZodString, z.ZodAny>;
                    description: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    attributes: Record<string, any>;
                    description: string;
                }, {
                    attributes: Record<string, any>;
                    description: string;
                }>;
            }, "strip", z.ZodTypeAny, {
                time: number;
                annotation: {
                    attributes: Record<string, any>;
                    description: string;
                };
            }, {
                time: number;
                annotation: {
                    attributes: Record<string, any>;
                    description: string;
                };
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            timeEvent: {
                time: number;
                annotation: {
                    attributes: Record<string, any>;
                    description: string;
                };
            }[];
        }, {
            timeEvent: {
                time: number;
                annotation: {
                    attributes: Record<string, any>;
                    description: string;
                };
            }[];
        }>>;
        truncated: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        attributes: Record<string, any>;
        traceId: string;
        spanId: string;
        startTime: number;
        endTime: number;
        displayName: string;
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
            attributes?: Record<string, any> | undefined;
            droppedAttributesCount?: number | undefined;
        }[] | undefined;
        sameProcessAsParentSpan?: {
            value: boolean;
        } | undefined;
        timeEvents?: {
            timeEvent: {
                time: number;
                annotation: {
                    attributes: Record<string, any>;
                    description: string;
                };
            }[];
        } | undefined;
        truncated?: boolean | undefined;
    }, {
        attributes: Record<string, any>;
        traceId: string;
        spanId: string;
        startTime: number;
        endTime: number;
        displayName: string;
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
            attributes?: Record<string, any> | undefined;
            droppedAttributesCount?: number | undefined;
        }[] | undefined;
        sameProcessAsParentSpan?: {
            value: boolean;
        } | undefined;
        timeEvents?: {
            timeEvent: {
                time: number;
                annotation: {
                    attributes: Record<string, any>;
                    description: string;
                };
            }[];
        } | undefined;
        truncated?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    traceId: string;
    spans: Record<string, {
        attributes: Record<string, any>;
        traceId: string;
        spanId: string;
        startTime: number;
        endTime: number;
        displayName: string;
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
            attributes?: Record<string, any> | undefined;
            droppedAttributesCount?: number | undefined;
        }[] | undefined;
        sameProcessAsParentSpan?: {
            value: boolean;
        } | undefined;
        timeEvents?: {
            timeEvent: {
                time: number;
                annotation: {
                    attributes: Record<string, any>;
                    description: string;
                };
            }[];
        } | undefined;
        truncated?: boolean | undefined;
    }>;
    startTime?: number | undefined;
    endTime?: number | undefined;
    displayName?: string | undefined;
}, {
    traceId: string;
    spans: Record<string, {
        attributes: Record<string, any>;
        traceId: string;
        spanId: string;
        startTime: number;
        endTime: number;
        displayName: string;
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
            attributes?: Record<string, any> | undefined;
            droppedAttributesCount?: number | undefined;
        }[] | undefined;
        sameProcessAsParentSpan?: {
            value: boolean;
        } | undefined;
        timeEvents?: {
            timeEvent: {
                time: number;
                annotation: {
                    attributes: Record<string, any>;
                    description: string;
                };
            }[];
        } | undefined;
        truncated?: boolean | undefined;
    }>;
    startTime?: number | undefined;
    endTime?: number | undefined;
    displayName?: string | undefined;
}>;
type TraceData = z.infer<typeof TraceDataSchema>;

export { InstrumentationLibrarySchema, LinkSchema, type PathMetadata, PathMetadataSchema, SpanContextSchema, type SpanData, SpanDataSchema, type SpanMetadata, SpanMetadataSchema, SpanStatusSchema, TimeEventSchema, type TraceData, TraceDataSchema, type TraceMetadata, TraceMetadataSchema };
