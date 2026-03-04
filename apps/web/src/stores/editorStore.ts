import { create } from 'zustand';

export type CompileStatus = 'idle' | 'parsing' | 'ir_gen' | 'codegen' | 'done' | 'error';

export interface EditorState {
    sourceCode: string;
    setSourceCode: (code: string) => void;
    status: CompileStatus;
    setStatus: (status: CompileStatus) => void;
    errors: string[];
    setErrors: (errors: string[]) => void;
    artifacts: Record<string, unknown> | null;
    setArtifacts: (artifacts: Record<string, unknown>) => void;
    logs: string[];
    appendLog: (log: string) => void;
    clearLogs: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    sourceCode: `#[orvyn::contract]
pub struct MyToken {
    #[orvyn::storage]
    balances: Mapping<Address, u128>,
    total_supply: u128,
}

#[orvyn::contract_impl]
impl MyToken {
    #[orvyn::constructor]
    pub fn new(initial_supply: u128) -> Self {
        let mut balances = Mapping::new();
        balances.insert(orvyn::msg::sender(), initial_supply);
        
        Self {
            balances,
            total_supply: initial_supply,
        }
    }
}`,
    setSourceCode: (code) => set({ sourceCode: code }),
    status: 'idle',
    setStatus: (status) => set({ status }),
    errors: [],
    setErrors: (errors) => set({ errors }),
    artifacts: null,
    setArtifacts: (artifacts) => set({ artifacts }),
    logs: [],
    appendLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
    clearLogs: () => set({ logs: [] }),
}));
