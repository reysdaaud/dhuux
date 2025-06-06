import isError from '../../../lib/is-error';
import { isNextRouterError } from '../is-next-router-error';
import { handleClientError } from '../errors/use-error-handler';
import { parseConsoleArgs } from '../../lib/console';
export const originConsoleError = globalThis.console.error;
// Patch console.error to collect information about hydration errors
export function patchConsoleError() {
    // Ensure it's only patched once
    if (typeof window === 'undefined') {
        return;
    }
    window.console.error = function error() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        let maybeError;
        if (process.env.NODE_ENV !== 'production') {
            const { error: replayedError } = parseConsoleArgs(args);
            if (replayedError) {
                maybeError = replayedError;
            } else if (isError(args[0])) {
                maybeError = args[0];
            } else {
                // See https://github.com/facebook/react/blob/d50323eb845c5fde0d720cae888bf35dedd05506/packages/react-reconciler/src/ReactFiberErrorLogger.js#L78
                maybeError = args[1];
            }
        } else {
            maybeError = args[0];
        }
        if (!isNextRouterError(maybeError)) {
            if (process.env.NODE_ENV !== 'production') {
                handleClientError(// replayed errors have their own complex format string that should be used,
                // but if we pass the error directly, `handleClientError` will ignore it
                maybeError, args, true);
            }
            originConsoleError.apply(window.console, args);
        }
    };
}

//# sourceMappingURL=intercept-console-error.js.map