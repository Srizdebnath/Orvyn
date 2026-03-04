'use client';

import Link from 'next/link';
import CodeEditor from '@/components/editor/CodeEditor';
import { useEditorStore } from '@/stores/editorStore';

export default function EditorPage({ params }: { params: { id: string } }) {
    const { status, sourceCode } = useEditorStore();

    return (
        <div className="h-screen flex flex-col bg-neutral-950 text-white overflow-hidden">
            {/* Top Header */}
            <header className="h-14 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-neutral-400 hover:text-white transition-colors">
                        &larr; <span className="text-sm">Dashboard</span>
                    </Link>
                    <div className="h-4 w-px bg-neutral-800"></div>
                    <div className="text-sm font-medium">My Project <span className="text-neutral-500 mx-2">/</span> src/main.rs</div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-500 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${status === 'idle' ? 'bg-neutral-500' : 'bg-orange-500 animate-pulse'}`}></span>
                        {status === 'idle' ? 'Saved' : 'Compiling...'}
                    </span>
                    <button className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors border border-neutral-700">
                        Compile
                    </button>
                    <button className="px-5 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-orange-500/20 active:scale-95">
                        Deploy &rarr;
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* File Explorer Sidebar */}
                <aside className="w-64 border-r border-neutral-800 bg-neutral-900/30 flex flex-col p-4 text-sm">
                    <div className="font-semibold text-neutral-300 mb-4 tracking-tight uppercase text-xs">Explorer</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-neutral-400 group cursor-pointer hover:bg-neutral-800/50 p-1.5 rounded">
                            <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors">▾</span> src
                        </div>
                        <div className="flex items-center gap-2 pl-6 text-orange-400 bg-orange-500/10 p-1.5 rounded border border-orange-500/20 cursor-pointer">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                            main.rs
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400 hover:text-neutral-200 cursor-pointer hover:bg-neutral-800/50 p-1.5 rounded">
                            <span className="text-neutral-500">▸</span> tests
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400 hover:text-neutral-200 pl-6 cursor-pointer hover:bg-neutral-800/50 p-1.5 rounded">
                            Cargo.toml
                        </div>
                    </div>

                    <div className="font-semibold text-neutral-300 mb-4 mt-8 tracking-tight uppercase text-xs">Targets</div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 text-neutral-300 cursor-pointer group">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-orange-500 focus:ring-orange-500/20 focus:ring-offset-neutral-900" />
                            <span className="group-hover:text-white transition-colors">Ethereum (EVM)</span>
                        </label>
                        <label className="flex items-center gap-3 text-neutral-300 cursor-pointer group">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-orange-500 focus:ring-orange-500/20 focus:ring-offset-neutral-900" />
                            <span className="group-hover:text-white transition-colors">Solana (BPF)</span>
                        </label>
                        <label className="flex items-center gap-3 text-neutral-500 cursor-not-allowed">
                            <input type="checkbox" disabled className="w-4 h-4 rounded border-neutral-800 bg-neutral-950" />
                            <span>Polygon <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400">PRO</span></span>
                        </label>
                    </div>
                </aside>

                {/* Editor Area */}
                <main className="flex-1 flex flex-col min-w-0 bg-neutral-950 p-4 pt-4">
                    <div className="flex-1 rounded-xl overflow-hidden border border-neutral-800/80 ring-1 ring-white/5 shadow-2xl">
                        <CodeEditor />
                    </div>

                    {/* Bottom Panel (Terminal/Console) */}
                    <div className="h-48 mt-4 border border-neutral-800 bg-neutral-900/50 rounded-xl flex flex-col shadow-lg overflow-hidden">
                        <div className="flex items-center border-b border-neutral-800 px-4 h-10 bg-neutral-900 gap-6">
                            <button className="text-sm font-medium text-white border-b-2 border-orange-500 h-full">Compile Output</button>
                            <button className="text-sm font-medium text-neutral-500 hover:text-neutral-300 transition-colors h-full">Problems
                                <span className="ml-2 w-5 h-5 inline-flex items-center justify-center rounded-full bg-neutral-800 text-xs">0</span>
                            </button>
                        </div>
                        <div className="p-4 font-mono text-sm text-neutral-400 overflow-y-auto flex-1">
                            {status === 'idle' ? (
                                <div className="text-neutral-600 italic">Ready to compile. Press Deploy or Compile to see output.</div>
                            ) : (
                                <div className="space-y-1">
                                    <div className="text-green-400">✓ Parsing source code...</div>
                                    <div className="text-green-400">✓ Generating LLVM IR...</div>
                                    <div className="text-orange-400 animate-pulse">⟳ Running EVM codegen...</div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
