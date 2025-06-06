"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    NEXTJS_HYDRATION_ERROR_LINK: null,
    REACT_HYDRATION_ERROR_LINK: null,
    getDefaultHydrationErrorMessage: null,
    getHydrationErrorStackInfo: null,
    isHydrationError: null,
    isReactHydrationErrorMessage: null,
    testReactHydrationWarning: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    NEXTJS_HYDRATION_ERROR_LINK: function() {
        return NEXTJS_HYDRATION_ERROR_LINK;
    },
    REACT_HYDRATION_ERROR_LINK: function() {
        return REACT_HYDRATION_ERROR_LINK;
    },
    getDefaultHydrationErrorMessage: function() {
        return getDefaultHydrationErrorMessage;
    },
    getHydrationErrorStackInfo: function() {
        return getHydrationErrorStackInfo;
    },
    isHydrationError: function() {
        return isHydrationError;
    },
    isReactHydrationErrorMessage: function() {
        return isReactHydrationErrorMessage;
    },
    testReactHydrationWarning: function() {
        return testReactHydrationWarning;
    }
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _iserror = /*#__PURE__*/ _interop_require_default._(require("../../lib/is-error"));
const hydrationErrorRegex = /hydration failed|while hydrating|content does not match|did not match|HTML didn't match/i;
const reactUnifiedMismatchWarning = "Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:";
const reactHydrationStartMessages = [
    reactUnifiedMismatchWarning,
    "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:"
];
const REACT_HYDRATION_ERROR_LINK = 'https://react.dev/link/hydration-mismatch';
const NEXTJS_HYDRATION_ERROR_LINK = 'https://nextjs.org/docs/messages/react-hydration-error';
const getDefaultHydrationErrorMessage = ()=>{
    return reactUnifiedMismatchWarning;
};
function isHydrationError(error) {
    return (0, _iserror.default)(error) && hydrationErrorRegex.test(error.message);
}
function isReactHydrationErrorMessage(msg) {
    return reactHydrationStartMessages.some((prefix)=>msg.startsWith(prefix));
}
const hydrationWarningRegexes = [
    /^In HTML, (.+?) cannot be a child of <(.+?)>\.(.*)\nThis will cause a hydration error\.(.*)/,
    /^In HTML, (.+?) cannot be a descendant of <(.+?)>\.\nThis will cause a hydration error\.(.*)/,
    /^In HTML, text nodes cannot be a child of <(.+?)>\.\nThis will cause a hydration error\./,
    /^In HTML, whitespace text nodes cannot be a child of <(.+?)>\. Make sure you don't have any extra whitespace between tags on each line of your source code\.\nThis will cause a hydration error\./,
    /^Expected server HTML to contain a matching <(.+?)> in <(.+?)>\.(.*)/,
    /^Did not expect server HTML to contain a <(.+?)> in <(.+?)>\.(.*)/,
    /^Expected server HTML to contain a matching text node for "(.+?)" in <(.+?)>\.(.*)/,
    /^Did not expect server HTML to contain the text node "(.+?)" in <(.+?)>\.(.*)/,
    /^Text content did not match\. Server: "(.+?)" Client: "(.+?)"(.*)/
];
function testReactHydrationWarning(msg) {
    if (typeof msg !== 'string' || !msg) return false;
    // React 18 has the `Warning: ` prefix.
    // React 19 does not.
    if (msg.startsWith('Warning: ')) {
        msg = msg.slice('Warning: '.length);
    }
    return hydrationWarningRegexes.some((regex)=>regex.test(msg));
}
function getHydrationErrorStackInfo(rawMessage) {
    rawMessage = rawMessage.replace(/^Error: /, '');
    rawMessage = rawMessage.replace('Warning: ', '');
    const isReactHydrationWarning = testReactHydrationWarning(rawMessage);
    if (!isReactHydrationErrorMessage(rawMessage) && !isReactHydrationWarning) {
        return {
            message: null,
            stack: rawMessage,
            diff: ''
        };
    }
    if (isReactHydrationWarning) {
        const [message, diffLog] = rawMessage.split('\n\n');
        return {
            message: message.trim(),
            stack: '',
            diff: (diffLog || '').trim()
        };
    }
    const firstLineBreak = rawMessage.indexOf('\n');
    rawMessage = rawMessage.slice(firstLineBreak + 1).trim();
    const [message, trailing] = rawMessage.split("" + REACT_HYDRATION_ERROR_LINK);
    const trimmedMessage = message.trim();
    // React built-in hydration diff starts with a newline, checking if length is > 1
    if (trailing && trailing.length > 1) {
        const stacks = [];
        const diffs = [];
        trailing.split('\n').forEach((line)=>{
            if (line.trim() === '') return;
            if (line.trim().startsWith('at ')) {
                stacks.push(line);
            } else {
                diffs.push(line);
            }
        });
        return {
            message: trimmedMessage,
            diff: diffs.join('\n'),
            stack: stacks.join('\n')
        };
    } else {
        return {
            message: trimmedMessage,
            stack: trailing
        };
    }
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=is-hydration-error.js.map