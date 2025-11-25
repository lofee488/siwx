export type Namespace = 
| "eip155"
| "solana"
| "bip322"
| "cosmos"
| "near"
| "polkadot";

export type ChainId = `${Namespace}:${string}`;

