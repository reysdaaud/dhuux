import { useCallback } from 'react';
export function useOpenInEditor(param) {
    let { file, lineNumber, column } = param === void 0 ? {} : param;
    const openInEditor = useCallback(()=>{
        if (file == null || lineNumber == null || column == null) return;
        const params = new URLSearchParams();
        params.append('file', file);
        params.append('lineNumber', String(lineNumber));
        params.append('column', String(column));
        self.fetch((process.env.__NEXT_ROUTER_BASEPATH || '') + "/__nextjs_launch-editor?" + params.toString()).then(()=>{}, (cause)=>{
            console.error('Failed to open file "' + file + " (" + lineNumber + ":" + column + ')" in your editor. Cause:', cause);
        });
    }, [
        file,
        lineNumber,
        column
    ]);
    return openInEditor;
}

//# sourceMappingURL=use-open-in-editor.js.map