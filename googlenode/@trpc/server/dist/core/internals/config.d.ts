import { ErrorFormatter } from '../../error/formatter';
import type { TRPCErrorShape } from '../../rpc';
/**
 * The initial generics that are used in the init function
 * @internal
 */
export interface RootConfigTypes {
    ctx: object;
    meta: object;
    errorShape: unknown;
    transformer: unknown;
}
/**
 * The default check to see if we're in a server
 */
export declare const isServerDefault: boolean;
/**
 * The runtime config that are used and actually represents real values underneath
 * @internal
 */
export interface RuntimeConfig<TTypes extends RootConfigTypes> {
    /**
     * Use a data transformer
     * @link https://trpc.io/docs/data-transformers
     */
    transformer: TTypes['transformer'];
    /**
     * Use custom error formatting
     * @link https://trpc.io/docs/error-formatting
     */
    errorFormatter: ErrorFormatter<TTypes['ctx'], TRPCErrorShape<number> & {
        [key: string]: any;
    }>;
    /**
     * Allow `@trpc/server` to run in non-server environments
     * @warning **Use with caution**, this should likely mainly be used within testing.
     * @default false
     */
    allowOutsideOfServer: boolean;
    /**
     * Is this a server environment?
     * @warning **Use with caution**, this should likely mainly be used within testing.
     * @default typeof window === 'undefined' || 'Deno' in window || process.env.NODE_ENV === 'test'
     */
    isServer: boolean;
    /**
     * Is this development?
     * Will be used to decide if the API should return stack traces
     * @default process.env.NODE_ENV !== 'production'
     */
    isDev: boolean;
    defaultMeta?: TTypes['meta'] extends object ? TTypes['meta'] : never;
}
/**
 * @internal
 */
export type CreateRootConfigTypes<TGenerics extends RootConfigTypes> = TGenerics;
/**
 * The config that is resolved after `initTRPC.create()` has been called
 * Combination of `InitTOptions` + `InitGenerics`
 * @internal
 */
export interface RootConfig<TGenerics extends RootConfigTypes> extends RuntimeConfig<TGenerics> {
    $types: TGenerics;
}
/**
 * @internal
 */
export type AnyRootConfig = RootConfig<{
    ctx: any;
    meta: any;
    errorShape: any;
    transformer: any;
}>;
//# sourceMappingURL=config.d.ts.map