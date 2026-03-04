'use client';

import Link from 'next/link';
import CodeEditor from '@/components/editor/CodeEditor';
import { useEditorStore } from '@/stores/editorStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useCallback } from 'react';

export default function EditorPage() {
    const { status, setStatus, logs, clearLogs, appendLog } = useEditorStore();
    const { send } = useWebSocket('ws://localhost:8080/ws');

    const handleCompile = useCallback(async () => {
        clearLogs();
        setStatus('parsing');
        appendLog('Initiating compilation...');

        try {
            const jobId = crypto.randomUUID();
            const response = await fetch('http://localhost:8080/api/v1/compile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: jobId,
                    contract_name: 'MyToken',
                    source: '...', // sourceCode from store should be used here
                    targets: ['ethereum', 'solana'],
                    optimization_level: 'optimized'
                }),
            });

            if (response.ok) {
                appendLog(`Job queued: ${jobId}`);
                send({ action: 'subscribe', job_id: jobId });
            } else {
                appendLog('Error: Failed to queue job');
                setStatus('idle');
            }
        } catch (error) {
            appendLog(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setStatus('idle');
        }
    }, [clearLogs, setStatus, appendLog, send]);

    return (
        <div className="h-screen flex flex-col text-white overflow-hidden bg-transparent p-4 gap-4">
            {/* Top Header */}
            <header className="h-16 rounded-2xl border border-white/10 bg-[#111111]/60 backdrop-blur-[20px] flex items-center justify-between px-6 shadow-2xl z-10 shrink-0">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-all">
                        &larr;
                    </Link>
                    <div className="h-6 w-px bg-white/10"></div>
                    <div className="text-base font-bold tracking-tight flex items-center gap-3">
                        <span className="text-orange-500 uppercase tracking-[0.2em] text-[10px]">Project</span>
                        <span>My Project <span className="text-neutral-500 mx-2">/</span> src/main.rs</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/20 border border-white/5 shadow-inner">
                        <span className={`w-2 h-2 rounded-full ${status === 'idle' ? 'bg-neutral-500' : 'bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]'}`}></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                            {status === 'idle' ? 'Ready' : 'Compiling...'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleCompile}
                            disabled={status !== 'idle'}
                            className="px-6 py-2 bg-neutral-800/80 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-bold transition-all border border-white/5 backdrop-blur-md"
                        >
                            Compile
                        </button>
                        <button className="px-8 py-2 bg-orange-500 hover:bg-orange-600 rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-500/30 active:scale-95">
                            Deploy &rarr;
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden gap-4">
                {/* File Explorer Sidebar */}
                <aside className="w-72 rounded-2xl border border-white/10 bg-[#111111]/60 backdrop-blur-[20px] flex flex-col p-6 text-sm shadow-2xl">
                    <div className="font-bold text-neutral-400 mb-6 tracking-[0.2em] uppercase text-[10px] opacity-70">File Explorer</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-neutral-300 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all">
                            <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors">▾</span> src
                        </div>
                        <div className="flex items-center gap-2 pl-8 text-orange-400 bg-orange-500/10 p-2.5 rounded-xl border border-orange-500/20 cursor-pointer shadow-inner">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                            <span className="font-bold">main.rs</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400 hover:text-neutral-200 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all">
                            <span className="text-neutral-500">▸</span> tests
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400 hover:text-neutral-200 pl-8 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all">
                            Cargo.toml
                        </div>
                    </div>

                    <div className="font-bold text-neutral-400 mb-6 mt-12 tracking-[0.2em] uppercase text-[10px] opacity-70">Architecture</div>
                    <div className="space-y-4">
                        <label className="flex items-center gap-4 text-neutral-300 cursor-pointer group p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/10 bg-black text-orange-500 focus:ring-orange-500/20" />
                            <span className="group-hover:text-white transition-colors font-bold text-xs uppercase tracking-widest">Ethereum</span>
                        </label>
                        <label className="flex items-center gap-4 text-neutral-300 cursor-pointer group p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/10 bg-black text-orange-500 focus:ring-orange-500/20" />
                            <span className="group-hover:text-white transition-colors font-bold text-xs uppercase tracking-widest">Solana</span>
                        </label>
                        <label className="flex items-center gap-4 text-neutral-500 cursor-not-allowed p-3 rounded-2xl bg-black/20 border border-transparent opacity-50">
                            <input type="checkbox" disabled className="w-4 h-4 rounded border-white/5 bg-black" />
                            <span className="font-bold text-xs uppercase tracking-widest flex items-center justify-between w-full">
                                Polygon
                                <span className="text-[8px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">PRO</span>
                            </span>
                        </label>
                    </div>

                    <div className="mt-auto p-5 rounded-2xl border border-white/10 bg-white/5 shadow-inner">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-neutral-400">Optimization</div>
                        <div className="flex items-center justify-between group cursor-pointer">
                            <span className="text-xs font-bold text-white">Advanced Mode</span>
                            <div className="w-8 h-4 bg-orange-500 rounded-full flex items-center px-1 shadow-[0_0_10px_rgba(249,115,22,0.4)]">
                                <div className="w-2.5 h-2.5 bg-white rounded-full ml-auto"></div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Editor Area */}
                <main className="flex-1 flex flex-col min-w-0 gap-4">
                    <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 bg-[#111111]/60 backdrop-blur-[20px] shadow-2xl relative">
                        <CodeEditor />
                    </div>

                    {/* Bottom Panel (Terminal/Console) */}
                    <div className="h-64 rounded-2xl border border-white/10 bg-[#111111]/80 backdrop-blur-[40px] flex flex-col shadow-2xl overflow-hidden relative">
                        <div className="flex items-center border-b border-white/5 px-6 h-12 bg-black/20 gap-8 shrink-0">
                            <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 border-b-2 border-orange-500 h-full">Compiler Output</button>
                            <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-300 transition-colors h-full flex items-center gap-2">
                                Problems
                                <span className="w-4 h-4 inline-flex items-center justify-center rounded-full bg-neutral-800 text-[10px]">0</span>
                            </button>
                        </div>
                        <div className="p-6 font-mono text-sm text-neutral-300 overflow-y-auto flex-1 custom-scrollbar">
                            {logs.length === 0 ? (
                                <div className="text-neutral-600 italic font-light flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-800"></span>
                                    Ready to compile. Press Deploy or Compile to see output.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {logs.map((log, i) => (
                                        <div key={i} className={`flex items-start gap-4 p-2 rounded-lg transition-colors hover:bg-white/5 ${log.includes('✓') || log.includes('successful') ? 'text-green-400 bg-green-500/5' :
                                            log.includes('Error') ? 'text-red-400 bg-red-500/5' :
                                                'text-neutral-300 font-light'
                                            }`}>
                                            <span className="text-[10px] text-neutral-600 mt-1 select-none">[{i + 1}]</span>
                                            <span className="leading-relaxed">{log.includes('⟳') ? <span className="animate-pulse inline-block mr-1">{log}</span> : log}</span>
                                        </div>
                                    ))}
                                    {status !== 'idle' && (
                                        <div className="flex items-center gap-4 p-2 text-orange-400 animate-pulse bg-orange-500/5 rounded-lg">
                                            <span className="text-[10px] text-neutral-600 mt-1 select-none">[*]</span>
                                            <span className="font-bold uppercase tracking-widest text-[10px]">⟳ Running pipeline...</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
