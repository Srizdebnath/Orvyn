'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const projectSchema = z.object({
    name: z.string().min(3, 'Project name must be at least 3 characters'),
    description: z.string().optional(),
    template: z.enum(['empty', 'erc20', 'nft']),
    chain: z.enum(['ethereum', 'solana']),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            template: 'empty',
            chain: 'ethereum',
        },
    });

    const onSubmit = async (data: ProjectFormValues) => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    description: data.description || '',
                    template: data.template,
                    main_chain: data.chain === 'solana' ? 'Solana' : 'Ethereum',
                }),
            });

            if (!response.ok) throw new Error('Failed to create project');

            const result = await response.json();
            router.push(`/editor/${result.id}`);
        } catch (err) {
            console.error(err);
            alert('Failed to create project. Please ensure the backend is running.');
        }
    };

    return (
        <div className="min-h-screen text-white flex items-center justify-center p-8 relative">
            <div className="max-w-xl w-full p-10 bg-[#111111]/60 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-500">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-40 bg-orange-500/10 blur-[80px] pointer-events-none rounded-full"></div>

                <div className="relative space-y-8">
                    <div className="text-center space-y-3">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white shadow-xl shadow-orange-500/20 text-3xl mx-auto mb-6 transform hover:rotate-12 transition-transform">
                            O
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight display-font">Create <span className="text-orange-500 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">New Project</span></h1>
                        <p className="text-neutral-400 text-sm font-light">Launch your multi-chain smart contract workspace in seconds.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 ml-1">Project Name</label>
                                <input
                                    {...register('name')}
                                    required
                                    type="text"
                                    placeholder="Enter project name..."
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all font-medium"
                                />
                                {errors.name && <p className="text-red-400 text-xs mt-1 font-bold italic">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 ml-1">Description</label>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    placeholder="Briefly describe your multi-chain contract..."
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all font-medium resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 ml-1">Chain</label>
                                    <select
                                        {...register('chain')}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="ethereum">Ethereum (EVM)</option>
                                        <option value="solana">Solana (BPF)</option>
                                    </select>
                                    {errors.chain && <p className="text-red-400 text-xs mt-1 font-bold italic">{errors.chain.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 ml-1">Template</label>
                                    <select
                                        {...register('template')}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="empty">Empty Rust Project</option>
                                        <option value="erc20">Standard ERC-20</option>
                                        <option value="nft">NFT (ERC-721)</option>
                                    </select>
                                    {errors.template && <p className="text-red-400 text-xs mt-1 font-bold italic">{errors.template.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Link
                                href="/dashboard"
                                className="flex-1 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-center font-bold text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-[2] px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg transition-all shadow-[0_0_30px_-5px_rgba(249,115,22,0.5)] active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Initializing...' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
