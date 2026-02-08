import { NextResponse } from "next/server"
import { address } from "@solana/kit"
import { getRpc } from "../_rpc"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pubkey = searchParams.get("address")

  if (!pubkey) {
    return NextResponse.json(
      { error: "Missing address" },
      { status: 400 }
    )
  }

  const network = searchParams.get("network") ?? "mainnet"

  const result = await getRpc(network)
    .getBalance(address(pubkey))
    .send()

  return NextResponse.json({
    balance: Number(result.value) / 1_000_000_000,
  })
}
