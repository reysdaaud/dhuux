import { g as getCauseFromUnknown } from './getCauseFromUnknown-ac5f46a2.js';

function getTRPCErrorFromUnknown(cause) {
    if (cause instanceof TRPCError) {
        return cause;
    }
    if (cause instanceof Error && cause.name === 'TRPCError') {
        // https://github.com/trpc/trpc/pull/4848
        return cause;
    }
    const trpcError = new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        cause,
    });
    // Inherit stack from error
    if (cause instanceof Error && cause.stack) {
        trpcError.stack = cause.stack;
    }
    return trpcError;
}
class TRPCError extends Error {
    constructor(opts) {
        const cause = getCauseFromUnknown(opts.cause);
        const message = opts.message ?? cause?.message ?? opts.code;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore https://github.com/tc39/proposal-error-cause
        super(message, { cause });
        this.code = opts.code;
        this.name = 'TRPCError';
        if (!this.cause) {
            // idk why this is needed, but it is
            this.cause = cause;
        }
    }
}

export { TRPCError as T, getTRPCErrorFromUnknown as g };
