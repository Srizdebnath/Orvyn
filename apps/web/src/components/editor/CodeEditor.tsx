'use client';

import Editor from '@monaco-editor/react';
import { useEditorStore } from '@/stores/editorStore';

export default function CodeEditor() {
    const { sourceCode, setSourceCode } = useEditorStore();

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setSourceCode(value);
        }
    };

    return (
        <div className="w-full h-full min-h-[500px] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl bg-[#1e1e1e]">
            <Editor
                height="100%"
                defaultLanguage="rust"
                theme="vs-dark"
                value={sourceCode}
                onChange={handleEditorChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                    padding: { top: 20 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    formatOnPaste: true,
                }}
                loading={<div className="h-full w-full flex items-center justify-center text-neutral-500 bg-[#1e1e1e]">Loading Editor...</div>}
            />
        </div>
    );
}
