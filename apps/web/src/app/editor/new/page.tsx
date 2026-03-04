'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

const projectSchema = z.object({
    name: z.string().min(3, 'Project name must be at least 3 characters'),
    description: z.string().optional(),
    template: z.enum(['blank', 'erc20', 'spl']),
    chainPrimary: z.boolean(),
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
            template: 'blank',
            chainPrimary: true,
        },
    });

    const onSubmit = async (data: ProjectFormValues) => {
        // Mock API call to create project
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Project created:', data);
        router.push('/editor/new-project-id');
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
            <div className="max-w-md w-full p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-32 bg-orange-500/10 blur-[50px] pointer-events-none rounded-full"></div>

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">New <span className="text-orange-500">Project</span></h1>
                    <p className="text-neutral-400 text-sm mb-8">Initialize a new smart contract workspace.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Project Name</label>
                            <input
                                {...register('name')}
                                defaultValue="My Project"
                                placeholder="e.g. DeFi Protocol"
                                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                            />
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Description (Optional)</label>
                            <textarea
                                {...register('description')}
                                placeholder="A brief description of your contract"
                                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors resize-none h-24"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Starting Template</label>
                            <select
                                {...register('template')}
                                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors appearance-none"
                            >
                                <option value="blank">Blank Rust Contract</option>
                                <option value="erc20">ERC20 Token (Ethereum/EVM)</option>
                                <option value="spl">SPL Token (Solana)</option>
                            </select>
                            {errors.template && <p className="text-red-400 text-xs mt-1">{errors.template.message}</p>}
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 py-3 px-4 rounded-xl border border-neutral-700 hover:bg-neutral-800 transition-colors text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 focus:ring-2 focus:ring-orange-500/50 transition-all shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)] text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
