import { NextResponse } from "next/server"
import { signature as sig } from "@solana/kit"
import { getRpc } from "../_rpc"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const signature = searchParams.get("signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    )
  }

  const network = searchParams.get("network") ?? "mainnet"

  const tx = await getRpc(network)
    .getTransaction(sig(signature), {
      encoding: "jsonParsed",
      maxSupportedTransactionVersion: 0,
    })
    .send()

  return NextResponse.json(tx)
}
