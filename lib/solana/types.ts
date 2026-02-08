export type WalletTransaction = {
  signature: string
  blockTime: number | null
  success: boolean
}

export type SolanaWallet = {
  mnemonic: string
  publicKey: string
  privateKey: string
  index: number
  label?: string
}