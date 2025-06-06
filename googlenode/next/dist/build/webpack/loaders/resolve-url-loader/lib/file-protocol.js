/*
The MIT License (MIT)

Copyright (c) 2016 Ben Holloway

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/ /**
 * Prepend file:// protocol to source path string or source-map sources.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    prepend: null,
    remove: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    prepend: function() {
        return prepend;
    },
    remove: function() {
        return remove;
    }
});
function prepend(candidate) {
    if (typeof candidate === 'string') {
        return 'file://' + candidate;
    } else if (candidate && typeof candidate === 'object' && Array.isArray(candidate.sources)) {
        return Object.assign({}, candidate, {
            sources: candidate.sources.map(prepend)
        });
    } else {
        throw Object.defineProperty(new Error('expected string|object'), "__NEXT_ERROR_CODE", {
            value: "E489",
            enumerable: false,
            configurable: true
        });
    }
}
function remove(candidate) {
    if (typeof candidate === 'string') {
        return candidate.replace(/^file:\/{2}/, '');
    } else if (candidate && typeof candidate === 'object' && Array.isArray(candidate.sources)) {
        return Object.assign({}, candidate, {
            sources: candidate.sources.map(remove)
        });
    } else {
        throw Object.defineProperty(new Error('expected string|object'), "__NEXT_ERROR_CODE", {
            value: "E489",
            enumerable: false,
            configurable: true
        });
    }
}

//# sourceMappingURL=file-protocol.js.map