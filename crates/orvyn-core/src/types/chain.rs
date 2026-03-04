use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Chain {
    Ethereum,
    Polygon,
    BinanceSmartChain,
    Solana,
    Near,
    Polkadot,
    Cosmos,
    Algorand,
    Arbitrum,
    Optimism,
    Base,
    ZkSync,
    StarkNet,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum VmTarget {
    Evm,
    SolanaBpf,
    Wasm,
    CosmWasm,
    Teal,
    ZkEvm,
    Cairo,
}

impl Chain {
    pub fn vm_target(&self) -> VmTarget {
        match self {
            Chain::Ethereum | Chain::Polygon | Chain::BinanceSmartChain => VmTarget::Evm,
            Chain::Solana => VmTarget::SolanaBpf,
            Chain::Near | Chain::Polkadot => VmTarget::Wasm,
            Chain::Cosmos => VmTarget::CosmWasm,
            Chain::Algorand => VmTarget::Teal,
            Chain::Arbitrum | Chain::Optimism | Chain::Base => VmTarget::Evm,
            Chain::ZkSync => VmTarget::ZkEvm,
            Chain::StarkNet => VmTarget::Cairo,
        }
    }

    pub fn is_evm(&self) -> bool {
        matches!(self.vm_target(), VmTarget::Evm | VmTarget::ZkEvm)
    }
}
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_vm_targets() {
        assert_eq!(Chain::Ethereum.vm_target(), VmTarget::Evm);
        assert_eq!(Chain::Solana.vm_target(), VmTarget::SolanaBpf);
        assert_eq!(Chain::Near.vm_target(), VmTarget::Wasm);
        assert_eq!(Chain::Arbitrum.vm_target(), VmTarget::Evm);
        assert_eq!(Chain::StarkNet.vm_target(), VmTarget::Cairo);
    }

    #[test]
    fn test_is_evm() {
        assert!(Chain::Ethereum.is_evm());
        assert!(Chain::Polygon.is_evm());
        assert!(Chain::Arbitrum.is_evm());
        assert!(!Chain::Solana.is_evm());
    }
}
