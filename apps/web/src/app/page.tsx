import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950">
      <main className="max-w-4xl w-full text-center space-y-12 animate-in fade-in zoom-in duration-700">
        <div className="space-y-6">
          <div className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-orange-400 bg-orange-400/10 border border-orange-400/20 mb-4 cursor-default">
            v1.0 Public Beta
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400">
            Write Rust once. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
              Deploy to any blockchain.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            The ultimate multi-chain smart contract platform. Compile and deploy your Rust code to Ethereum, Solana, and more in seconds.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_0_30px_-5px_rgba(249,115,22,0.4)]"
          >
            Start for free
          </Link>
          <Link
            href="https://github.com/Srizdebnath/Orvyn"
            target="_blank"
            className="px-8 py-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-lg transition-all duration-200 flex items-center gap-2 border border-neutral-700 hover:border-neutral-600"
          >
            View GitHub
          </Link>
        </div>

        <div className="mt-20 p-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm text-left font-mono text-sm overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-400 opacity-50"></div>
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <pre className="text-neutral-300">
            <code className="block text-green-400 mb-2">{"// Deploy to multiple chains in one command"}</code>
            <code className="block"><span className="text-blue-400">orvyn</span> deploy MyToken.rs --targets <span className="text-orange-400">ethereum,solana</span></code>
            <code className="block text-neutral-500 mt-2">→ Compiling standard Rust... [64ms]</code>
            <code className="block text-neutral-500">→ Generating EVM Bytecode... [12ms]</code>
            <code className="block text-neutral-500">→ Generating Solana BPF... [15ms]</code>
            <code className="block text-green-400 mt-2">✓ Successfully deployed to Ethereum (0x...)</code>
            <code className="block text-green-400">✓ Successfully deployed to Solana (AaBb...)</code>
          </pre>
        </div>
      </main>
    </div>
  );
}
