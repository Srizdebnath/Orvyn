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
        <div className="min-h-screen bg-neutral-950 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-neutral-800 bg-neutral-900/30 p-6 flex flex-col gap-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">
                        O
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Orvyn</span>
                </div>

                <nav className="flex flex-col gap-2">
                    <div className="px-3 py-2 text-sm font-medium text-white bg-white/10 rounded-lg">Projects</div>
                    <div className="px-3 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors">Templates</div>
                    <div className="px-3 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors">History</div>
                    <div className="px-3 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors">Settings</div>
                </nav>

                <div className="mt-auto p-4 rounded-xl border border-neutral-800 bg-neutral-900/50">
                    <div className="text-sm font-medium mb-2">Free Tier</div>
                    <div className="text-xs text-neutral-400 mb-3">2/3 chains unlocked</div>
                    <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-orange-500 rounded-full"></div>
                    </div>
                    <button className="mt-4 w-full text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors">
                        Upgrade to Pro &rarr;
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto">
                <div className="max-w-5xl mx-auto space-y-10">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
                        <Link
                            href="/editor/new"
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-orange-500/20"
                        >
                            + New Project
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-full py-12 text-center text-neutral-500 italic">Loading projects...</div>
                        ) : projects.length === 0 ? (
                            <div className="col-span-full py-24 border-2 border-dashed border-neutral-800 rounded-3xl flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center mb-4 text-neutral-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-neutral-300">No Projects Yet</h3>
                                <p className="text-neutral-500 mt-2 mb-6 max-w-xs">Start your first multi-chain contract by creating a new project.</p>
                                <Link href="/editor/new" className="px-6 py-2 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-xl hover:bg-orange-500 hover:text-white transition-all font-medium">Create Project</Link>
                            </div>
                        ) : projects.map((project) => (
                            <Link key={project.id} href={`/editor/${project.id}`} className="block group">
                                <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-orange-500/50 transition-all group relative overflow-hidden h-full">
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="text-orange-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold">
                                            {project.name.charAt(0)}
                                        </div>
                                        <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-400/10 text-green-400 border border-green-400/20 uppercase tracking-wider">
                                            Ready
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-1 group-hover:text-orange-400 transition-colors uppercase tracking-tight">{project.name}</h3>
                                    <p className="text-sm text-neutral-400 mb-6 line-clamp-2">{project.description || "Multi-chain contract project."}</p>
                                    <div className="mt-auto flex items-center justify-between text-[11px] text-neutral-500 font-mono border-t border-neutral-800/50 pt-4">
                                        <span className="flex items-center gap-1.5 text-neutral-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                            {project.main_chain}
                                        </span>
                                        <span>{formatTimeAgo(project.created_at)}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="pt-4">
                        <h2 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-3">
                            <span className="w-8 h-px bg-neutral-800"></span>
                            Recent Deployments
                        </h2>
                        <div className="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/10 backdrop-blur-sm">
                            <div className="flex items-center justify-between p-4 border-b border-neutral-800 hover:bg-neutral-800/20 transition-colors">
                                <div>
                                    <div className="font-medium flex items-center gap-2">
                                        MyToken &rarr; Ethereum
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1 font-bold uppercase tracking-tighter">
                                            <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></span> Verified
                                        </span>
                                    </div>
                                    <div className="text-xs text-neutral-500 mt-1 font-mono text-white/40">0x1234...abcd</div>
                                </div>
                                <div className="text-xs text-neutral-500">2 days ago</div>
                            </div>
                            <div className="flex items-center justify-between p-4 hover:bg-neutral-800/20 transition-colors text-neutral-400 grayscale opacity-70 border-b border-neutral-800">
                                <div>
                                    <div className="font-medium flex items-center gap-2">
                                        MyToken &rarr; Solana
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-500 border border-neutral-700 flex items-center gap-1 font-bold uppercase tracking-tighter">
                                            Pending
                                        </span>
                                    </div>
                                    <div className="text-xs text-neutral-500 mt-1 font-mono">AaBb...XxYy</div>
                                </div>
                                <div className="text-xs text-neutral-500 text-white/20">2 days ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
