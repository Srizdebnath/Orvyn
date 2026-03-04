import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-neutral-800 bg-neutral-900/30 p-6 flex flex-col gap-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">
                        O
                    </div>
                    <span className="text-xl font-bold tracking-tight">Orvyn</span>
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
            <main className="flex-1 p-10">
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
                        {/* Project Card Mock */}
                        <Link href="/editor/my-token" className="block group">
                            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/30 hover:bg-neutral-900/60 hover:border-neutral-700 transition-all cursor-pointer">
                                <h3 className="text-lg font-semibold group-hover:text-orange-400 transition-colors">MyToken</h3>
                                <div className="flex gap-2 mt-3">
                                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Ethereum</span>
                                    <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">Solana</span>
                                </div>
                                <p className="text-xs text-neutral-500 mt-6">Updated 2 days ago</p>
                            </div>
                        </Link>

                        {/* Template Card Mock */}
                        <Link href="/editor/new?template=spl" className="block">
                            <div className="p-6 rounded-2xl border border-dashed border-neutral-700/50 hover:border-neutral-500 hover:bg-neutral-900/30 transition-all cursor-pointer h-full flex flex-col items-center justify-center text-center">
                                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center mb-3">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400"><path d="M12 5v14M5 12h14" /></svg>
                                </div>
                                <h3 className="font-medium text-neutral-300">Create from Template</h3>
                            </div>
                        </Link>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold tracking-tight mb-6">Recent Deployments</h2>
                        <div className="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/30">
                            <div className="flex items-center justify-between p-4 border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                                <div>
                                    <div className="font-medium flex items-center gap-2">
                                        MyToken &rarr; Ethereum
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Verified
                                        </span>
                                    </div>
                                    <div className="text-sm text-neutral-500 mt-1 font-mono">0x1234...abcd</div>
                                </div>
                                <div className="text-sm text-neutral-500">2 days ago</div>
                            </div>
                            <div className="flex items-center justify-between p-4 hover:bg-neutral-800/50 transition-colors">
                                <div>
                                    <div className="font-medium flex items-center gap-2">
                                        MyToken &rarr; Solana
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Verified
                                        </span>
                                    </div>
                                    <div className="text-sm text-neutral-500 mt-1 font-mono">AaBb...XxYy</div>
                                </div>
                                <div className="text-sm text-neutral-500">2 days ago</div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
