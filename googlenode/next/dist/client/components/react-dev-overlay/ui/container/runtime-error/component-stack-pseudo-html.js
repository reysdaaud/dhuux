"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    PSEUDO_HTML_DIFF_STYLES: null,
    PseudoHtmlDiff: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    PSEUDO_HTML_DIFF_STYLES: function() {
        return PSEUDO_HTML_DIFF_STYLES;
    },
    PseudoHtmlDiff: function() {
        return _diffview.PseudoHtmlDiff;
    }
});
const _diffview = require("../../components/hydration-diff/diff-view");
const PSEUDO_HTML_DIFF_STYLES = "\n  [data-nextjs-container-errors-pseudo-html] {\n    padding: 8px 0;\n    margin: 8px 0;\n    border: 1px solid var(--color-gray-400);\n    background: var(--color-background-200);\n    color: var(--color-syntax-constant);\n    font-family: var(--font-stack-monospace);\n    font-size: var(--size-12);\n    line-height: 1.33em; /* 16px in 12px font size */\n    border-radius: var(--rounded-md-2);\n  }\n  [data-nextjs-container-errors-pseudo-html-line] {\n    display: inline-block;\n    width: 100%;\n    padding-left: 40px;\n    line-height: calc(5 / 3);\n  }\n  [data-nextjs-container-errors-pseudo-html--diff='error'] {\n    background: var(--color-amber-100);\n    font-weight: bold;\n  }\n  [data-nextjs-container-errors-pseudo-html-collapse-button] {\n    all: unset;\n    margin-left: 12px;\n    &:focus {\n      outline: none;\n    }\n  }\n  [data-nextjs-container-errors-pseudo-html--diff='add'] {\n    background: var(--color-green-300);\n  }\n  [data-nextjs-container-errors-pseudo-html-line-sign] {\n    margin-left: calc(24px * -1);\n    margin-right: 24px;\n  }\n  [data-nextjs-container-errors-pseudo-html--diff='add']\n    [data-nextjs-container-errors-pseudo-html-line-sign] {\n    color: var(--color-green-900);\n  }\n  [data-nextjs-container-errors-pseudo-html--diff='remove'] {\n    background: var(--color-red-300);\n  }\n  [data-nextjs-container-errors-pseudo-html--diff='remove']\n    [data-nextjs-container-errors-pseudo-html-line-sign] {\n    color: var(--color-red-900);\n    margin-left: calc(24px * -1);\n    margin-right: 24px;\n  }\n  [data-nextjs-container-errors-pseudo-html--diff='error']\n    [data-nextjs-container-errors-pseudo-html-line-sign] {\n    color: var(--color-amber-900);\n  }\n  \n  [data-nextjs-container-errors-pseudo-html--hint] {\n    display: inline-block;\n    font-size: 0;\n    height: 0;\n  }\n  [data-nextjs-container-errors-pseudo-html--tag-adjacent='false'] {\n    color: var(--color-accents-1);\n  }\n  .nextjs__container_errors__component-stack {\n    margin: 0;\n  }\n  [data-nextjs-container-errors-pseudo-html-collapse='true']\n    .nextjs__container_errors__component-stack\n    code {\n    max-height: 120px;\n    mask-image: linear-gradient(to bottom,rgba(0,0,0,0) 0%,black 10%);\n    padding-bottom: 40px;\n  }\n  .nextjs__container_errors__component-stack code {\n    display: block;\n    width: 100%;\n    white-space: pre-wrap;\n    scroll-snap-type: y mandatory;\n    overflow-y: hidden;\n  }\n  [data-nextjs-container-errors-pseudo-html--diff] {\n    scroll-snap-align: center;\n  }\n  .error-overlay-hydration-error-diff-plus-icon {\n    color: var(--color-green-900);\n  }\n  .error-overlay-hydration-error-diff-minus-icon {\n    color: var(--color-red-900);\n  }\n";

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=component-stack-pseudo-html.js.map