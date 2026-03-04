import Link from 'next/link';
export default function LandingPage() {
  return (
    <div className="min-h-screen text-white flex flex-col p-8 relative overflow-x-hidden">

      {/* Absolute Widgets for bottom left */}
      <div className="fixed bottom-8 left-8 flex flex-col gap-4 z-50">
        {/* Free Tier Widget */}
        <div className="w-64 p-5 rounded-2xl bg-[#111111]/60 backdrop-blur-[20px] border border-white/10 shadow-2xl">
          <div className="text-sm font-semibold mb-2">Free Tier</div>
          <div className="text-xs text-neutral-300 mb-3">2/3 chains unlocked</div>
          <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-orange-500 rounded-full"></div>
          </div>
          <button className="mt-4 w-full text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors">
            Upgrade to Pro &rarr;
          </button>
        </div>

        {/* 1 Issue Widget */}
        <div className="px-5 py-3.5 rounded-xl bg-[#111111]/60 backdrop-blur-[20px] border border-white/10 shadow-2xl flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
          <span className="text-sm font-semibold tracking-wide">1 Issue</span>
        </div>
      </div>

      <main className="max-w-4xl w-full mx-auto space-y-16 animate-in fade-in zoom-in duration-700 pb-20 relative z-10 pt-10">

        {/* Hero Section */}
        <div className="p-12 md:p-16 rounded-[2.5rem] bg-[#111111]/60 backdrop-blur-[20px] border border-white/10 shadow-2xl text-center space-y-10">
          <div className="space-y-6">
            <div className="inline-block rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 mb-2 shadow-lg shadow-orange-500/10">
              v1.0 Public Beta
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-300 drop-shadow-sm leading-tight">
              Write Rust once. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Deploy to any blockchain.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-200 max-w-2xl mx-auto font-light leading-relaxed">
              The ultimate multi-chain smart contract platform. Compile and deploy your Rust code to Ethereum, Solana, and more in seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="px-10 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_0_30px_-5px_rgba(249,115,22,0.5)]"
            >
              Start for free
            </Link>
            <Link
              href="https://github.com/Srizdebnath/Orvyn"
              target="_blank"
              className="px-10 py-4 rounded-xl bg-[#222222]/80 hover:bg-[#333333] text-white font-bold text-lg transition-all duration-200 flex items-center gap-2 border border-white/10 backdrop-blur-md"
            >
              View GitHub
            </Link>
          </div>
        </div>

        {/* My Projects & Recent Deployments */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-8 drop-shadow-xl text-white">My Projects</h2>
            <div className="max-w-3xl mx-auto p-16 bg-[#111111]/60 backdrop-blur-[20px] border border-white/20 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-neutral-300 border border-white/10 shadow-inner">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">No Projects Yet</h3>
              <p className="text-neutral-300 text-lg mb-8 max-w-md font-light leading-relaxed">Start your first multi-chain contract by creating a new project.</p>
              <Link href="/editor/new" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all font-bold text-lg shadow-[0_0_20px_rgba(249,115,22,0.3)]">Create Project</Link>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight mb-6 drop-shadow-xl text-white text-center">Recent Deployments</h2>
            <div className="border border-white/10 rounded-3xl overflow-hidden bg-[#111111]/60 backdrop-blur-[20px] shadow-2xl">
              <div className="flex items-center justify-between p-7 border-b border-white/5 hover:bg-white/5 transition-colors">
                <div>
                  <div className="font-semibold text-lg flex items-center gap-3 mb-1">
                    MyToken &rarr; Ethereum
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-2 font-bold uppercase tracking-tight shadow-inner">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span> Verified
                    </span>
                  </div>
                  <div className="text-sm text-neutral-400 font-mono tracking-wide">0x1234...abcd</div>
                </div>
                <div className="text-sm text-neutral-300 font-medium bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">2 days ago</div>
              </div>
              <div className="flex items-center justify-between p-7 hover:bg-white/5 transition-colors">
                <div>
                  <div className="font-semibold text-lg flex items-center gap-3 mb-1 text-white">
                    MyToken &rarr; Solana
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-2 font-bold uppercase tracking-tight shadow-inner">
                      <span className="w-2 h-2 rounded-full bg-orange-400"></span> Pending
                    </span>
                  </div>
                  <div className="text-sm text-neutral-400 font-mono tracking-wide">AaBb...XxYy</div>
                </div>
                <div className="text-sm text-neutral-300 font-medium bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">2 days ago</div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
