/*

Files in the rsc directory are meant to be packaged as part of the RSC graph using next-app-loader.

*/ import * as React from 'react';
function notImplemented() {
    throw Object.defineProperty(new Error('Taint can only be used with the taint flag.'), "__NEXT_ERROR_CODE", {
        value: "E354",
        enumerable: false,
        configurable: true
    });
}
export const taintObjectReference = process.env.__NEXT_EXPERIMENTAL_REACT ? React.experimental_taintObjectReference : notImplemented;
export const taintUniqueValue = process.env.__NEXT_EXPERIMENTAL_REACT ? React.experimental_taintUniqueValue : notImplemented;

//# sourceMappingURL=taint.js.map