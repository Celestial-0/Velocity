import * as bip39 from "bip39"
import nacl from "tweetnacl"
import bs58 from "bs58"
import { derivePath } from "ed25519-hd-key"
import type { SolanaWallet } from "@/lib/solana/types"

function deriveFromMnemonic(mnemonic: string, index: number = 0, label?: string): SolanaWallet {
  const normalized = mnemonic.trim()

  if (!bip39.validateMnemonic(normalized)) {
    throw new Error("Invalid mnemonic phrase")
  }

  // 1. Mnemonic → seed (512 bits)
  const seed = bip39.mnemonicToSeedSync(normalized)

  // 2. SLIP-0010 Ed25519 derivation
  // Path: m/44'/501'/${index}'/0'
  const path = `m/44'/501'/${index}'/0'`
  const { key } = derivePath(path, seed.toString("hex"))

  // 3. Ed25519 keypair
  const keypair = nacl.sign.keyPair.fromSeed(key)

  return {
    mnemonic: normalized,
    publicKey: bs58.encode(keypair.publicKey),
    privateKey: bs58.encode(keypair.secretKey),
    index,
    label,
  }
}

/** Generate new 12-word wallet */
export function generateSolanaWallet(): SolanaWallet {
  const mnemonic = bip39.generateMnemonic(128)
  return deriveFromMnemonic(mnemonic)
}

/** Restore wallet from existing mnemonic */
export function restoreSolanaWallet(mnemonic: string, index: number = 0, label?: string): SolanaWallet {
  return deriveFromMnemonic(mnemonic, index, label)
}
