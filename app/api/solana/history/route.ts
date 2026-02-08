import { NextResponse } from "next/server"
import { address } from "@solana/kit"
import { getRpc } from "../_rpc"
import type { WalletTransaction } from "@/lib/solana/types"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pubkey = searchParams.get("address")
  const limit = Number(searchParams.get("limit") ?? 10)
  const network = searchParams.get("network") ?? "mainnet"

  if (!pubkey) {
    return NextResponse.json(
      { error: "Missing address" },
      { status: 400 }
    )
  }

  const signatures = await getRpc(network)
    .getSignaturesForAddress(
      address(pubkey),
      { limit }
    )
    .send()

  const txs: WalletTransaction[] = signatures.map((s) => ({
    signature: String(s.signature),
    blockTime: s.blockTime === null ? null : Number(s.blockTime),
    success: s.err === null,
  }))

  return NextResponse.json(txs)
}
