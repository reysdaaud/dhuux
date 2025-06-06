"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ShadowPortal", {
    enumerable: true,
    get: function() {
        return ShadowPortal;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _react = /*#__PURE__*/ _interop_require_wildcard._(require("react"));
const _reactdom = require("react-dom");
const _shared = require("../../shared");
function ShadowPortal(param) {
    let { children } = param;
    let portalNode = _react.useRef(null);
    let shadowNode = _react.useRef(null);
    let [, forceUpdate] = _react.useState();
    _react.useLayoutEffect(()=>{
        const ownerDocument = document;
        portalNode.current = ownerDocument.createElement('nextjs-portal');
        // load default color preference from localstorage
        if (typeof localStorage !== 'undefined') {
            const theme = localStorage.getItem(_shared.STORAGE_KEY_THEME);
            if (theme === 'dark') {
                portalNode.current.classList.add('dark');
                portalNode.current.classList.remove('light');
            } else if (theme === 'light') {
                portalNode.current.classList.remove('dark');
                portalNode.current.classList.add('light');
            }
        }
        shadowNode.current = portalNode.current.attachShadow({
            mode: 'open'
        });
        ownerDocument.body.appendChild(portalNode.current);
        forceUpdate({});
        return ()=>{
            if (portalNode.current && portalNode.current.ownerDocument) {
                portalNode.current.ownerDocument.body.removeChild(portalNode.current);
            }
        };
    }, []);
    return shadowNode.current ? /*#__PURE__*/ (0, _reactdom.createPortal)(children, shadowNode.current) : null;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=shadow-portal.js.map