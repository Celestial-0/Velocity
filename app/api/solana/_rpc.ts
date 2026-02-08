import { createSolanaRpc } from "@solana/kit"

export const getRpc = (network: string = "mainnet") => {
  let cluster = `https://mainnet.helius-rpc.com/?api-key=${process.env.HAPI_KEY}`;

  if (network === "devnet") {
    cluster = "https://api.devnet.solana.com";
  } else if (network === "testnet") {
    cluster = "https://api.testnet.solana.com";
  }

  return createSolanaRpc(cluster);
}
