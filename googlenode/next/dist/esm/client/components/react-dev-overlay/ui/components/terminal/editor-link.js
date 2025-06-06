import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useOpenInEditor } from '../../utils/use-open-in-editor';
export function EditorLink(param) {
    let { file, location } = param;
    var _location_line, _location_column;
    const open = useOpenInEditor({
        file,
        lineNumber: (_location_line = location == null ? void 0 : location.line) != null ? _location_line : 1,
        column: (_location_column = location == null ? void 0 : location.column) != null ? _location_column : 0
    });
    return /*#__PURE__*/ _jsxs("div", {
        "data-with-open-in-editor-link": true,
        "data-with-open-in-editor-link-import-trace": true,
        tabIndex: 10,
        role: 'link',
        onClick: open,
        title: 'Click to open in your editor',
        children: [
            file,
            location ? ":" + location.line + ":" + location.column : null,
            /*#__PURE__*/ _jsxs("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: [
                    /*#__PURE__*/ _jsx("path", {
                        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                    }),
                    /*#__PURE__*/ _jsx("polyline", {
                        points: "15 3 21 3 21 9"
                    }),
                    /*#__PURE__*/ _jsx("line", {
                        x1: "10",
                        y1: "14",
                        x2: "21",
                        y2: "3"
                    })
                ]
            })
        ]
    });
}
export const EDITOR_LINK_STYLES = "\n  [data-with-open-in-editor-link] svg {\n    width: auto;\n    height: var(--size-14);\n    margin-left: 8px;\n  }\n  [data-with-open-in-editor-link] {\n    cursor: pointer;\n  }\n  [data-with-open-in-editor-link]:hover {\n    text-decoration: underline dotted;\n  }\n  [data-with-open-in-editor-link-import-trace] {\n    margin-left: 16px;\n  }\n";

//# sourceMappingURL=editor-link.js.map