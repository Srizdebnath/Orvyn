import { create } from 'zustand';

export type CompileStatus = 'idle' | 'parsing' | 'ir_gen' | 'codegen' | 'done' | 'error';

export interface EditorState {
    sourceCode: string;
    setSourceCode: (code: string) => void;
    status: CompileStatus;
    setStatus: (status: CompileStatus) => void;
    errors: string[];
    setErrors: (errors: string[]) => void;
    artifacts: Record<string, any> | null;
    setArtifacts: (artifacts: Record<string, any>) => void;
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
}));
