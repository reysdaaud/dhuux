"use strict";
const ERROR_MESSAGE = 'Internal Error: do not use legacy react-dom/server APIs. If you encountered this error, please open an issue on the Next.js repo.';
function error() {
    throw Object.defineProperty(new Error(ERROR_MESSAGE), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
}
var b;
if (process.env.NODE_ENV === 'production') {
    b = require('next/dist/compiled/react-dom/cjs/react-dom-server.edge.production.js');
} else {
    b = require('next/dist/compiled/react-dom/cjs/react-dom-server.edge.development.js');
}
exports.version = b.version;
exports.renderToReadableStream = b.renderToReadableStream;
exports.renderToString = error;
exports.renderToStaticMarkup = error;
if (b.resume) {
    exports.resume = b.resume;
}

//# sourceMappingURL=react-dom-server-edge.js.map