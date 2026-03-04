'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Project {
    id: string;
    name: string;
    description: string | null;
    template: string;
    main_chain: string;
    created_at: string;
}

export default function DashboardPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/api/v1/projects')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProjects(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        return `${diffDays} days ago`;
    };

    return (
        <div className="min-h-screen text-white flex p-8 gap-8 relative overflow-x-hidden">
            {/* Widgets Layer (for consistency with landing) */}
            <div className="fixed bottom-8 left-8 flex flex-col gap-4 z-50 pointer-events-none">
                {/* 1 Issue Widget */}
                <div className="px-5 py-3.5 rounded-xl bg-[#111111]/60 backdrop-blur-[20px] border border-white/10 shadow-2xl flex items-center gap-3 pointer-events-auto">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                    <span className="text-sm font-semibold tracking-wide">1 Issue</span>
                </div>
            </div>

            {/* Sidebar */}
            <aside className="w-72 rounded-[2rem] border border-white/10 bg-[#111111]/60 backdrop-blur-[20px] p-8 flex flex-col gap-10 shadow-2xl h-[calc(100vh-4rem)] sticky top-8">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20 text-xl">
                        O
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white display-font">Orvyn</span>
                </div>

                <nav className="flex flex-col gap-2">
                    <div className="px-4 py-3 text-sm font-bold text-white bg-white/10 rounded-xl border border-white/5">Projects</div>
                    <div className="px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition-all border border-transparent hover:border-white/5">Templates</div>
                    <div className="px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition-all border border-transparent hover:border-white/5">History</div>
                    <div className="px-4 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition-all border border-transparent hover:border-white/5">Settings</div>
                </nav>

                <div className="mt-auto p-6 rounded-2xl border border-white/10 bg-white/5 shadow-inner">
                    <div className="text-sm font-bold mb-2">Free Tier</div>
                    <div className="text-xs text-neutral-400 mb-4">2/3 chains unlocked</div>
                    <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                    </div>
                    <button className="mt-5 w-full text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors uppercase tracking-widest">
                        Upgrade to Pro &rarr;
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 space-y-10 animate-in fade-in duration-700">
                <div className="flex items-center justify-between p-8 rounded-[2rem] bg-[#111111]/60 backdrop-blur-[20px] border border-white/10 shadow-2xl">
                    <h1 className="text-4xl font-bold tracking-tight text-white display-font">My <span className="text-orange-500">Projects</span></h1>
                    <Link
                        href="/editor/new"
                        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl font-bold text-sm transition-all shadow-[0_0_25px_-5px_rgba(249,115,22,0.4)] active:scale-95"
                    >
                        + New Project
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {loading ? (
                        <div className="col-span-full py-20 text-center rounded-[2rem] bg-[#111111]/40 backdrop-blur-md border border-white/5 text-neutral-500 italic">
                            Loading your workspace...
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="col-span-full py-32 border-2 border-dashed border-white/10 rounded-[2.5rem] bg-[#111111]/40 backdrop-blur-md flex flex-col items-center justify-center text-center p-10 shadow-2xl">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-neutral-400 border border-white/5">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">No Projects Yet</h3>
                            <p className="text-neutral-400 mb-8 max-w-sm">Start your first multi-chain contract by creating a new project.</p>
                            <Link href="/editor/new" className="px-10 py-4 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-xl hover:bg-orange-500 hover:text-white transition-all font-bold text-lg">Create First Project</Link>
                        </div>
                    ) : projects.map((project) => (
                        <Link key={project.id} href={`/editor/${project.id}`} className="block group">
                            <div className="p-8 rounded-[2rem] bg-[#111111]/60 backdrop-blur-[20px] border border-white/10 hover:border-orange-500/50 transition-all shadow-2xl h-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="text-orange-500">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-xl shadow-inner">
                                        {project.name.charAt(0)}
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-widest shadow-inner">
                                        Ready
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2 group-hover:text-orange-400 transition-colors uppercase tracking-tight text-white">{project.name}</h3>
                                <p className="text-sm text-neutral-400 mb-8 line-clamp-2 leading-relaxed">{project.description || "Multi-chain contract project."}</p>
                                <div className="mt-auto flex items-center justify-between text-[11px] text-neutral-500 font-mono border-t border-white/5 pt-6">
                                    <span className="flex items-center gap-2 text-neutral-300 font-bold">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                        {project.main_chain}
                                    </span>
                                    <span className="bg-white/5 px-2 py-1 rounded border border-white/5">{formatTimeAgo(project.created_at)}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="p-8 rounded-[2rem] bg-[#111111]/60 backdrop-blur-[20px] border border-white/10 shadow-2xl">
                    <h2 className="text-2xl font-bold tracking-tight mb-8 flex items-center gap-4 text-white">
                        <span className="w-12 h-px bg-white/20"></span>
                        Recent Deployments
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                            <div>
                                <div className="font-bold text-lg flex items-center gap-3 text-white mb-1">
                                    MyToken &rarr; Ethereum
                                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-2 font-bold uppercase tracking-widest shadow-inner">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Verified
                                    </span>
                                </div>
                                <div className="text-xs text-neutral-500 mt-1 font-mono group-hover:text-neutral-400 transition-colors">0x1234...abcd</div>
                            </div>
                            <div className="text-xs text-neutral-400 font-bold border border-white/5 px-3 py-1.5 rounded-lg bg-black/20">2 days ago</div>
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                            <div>
                                <div className="font-bold text-lg flex items-center gap-3 text-white mb-1">
                                    MyToken &rarr; Solana
                                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#333333] text-neutral-400 border border-white/5 flex items-center gap-2 font-bold uppercase tracking-widest">
                                        Pending
                                    </span>
                                </div>
                                <div className="text-xs text-neutral-500 mt-1 font-mono group-hover:text-neutral-400 transition-colors">AaBb...XxYy</div>
                            </div>
                            <div className="text-xs text-neutral-400 font-bold border border-white/5 px-3 py-1.5 rounded-lg bg-black/20">2 days ago</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
