"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, CreditCard, History, Terminal, Wallet, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Content for Wallet Generation Steps
const WALLET_STEPS = [
    {
        title: "1. Mnemonic Generation",
        description: "BIP-39 Standard",
        content: "A 12-word mnemonic phrase is generated using 128 bits of entropy. This phrase is the human-readable backup of your wallet.",
        code: `// lib/solana/derive.ts
import * as bip39 from "bip39"

const mnemonic = bip39.generateMnemonic(128)
// "witch collapse practice feed shame open despair creek road again ice least"`,
        icon: <ShieldCheck className="w-10 h-10 text-emerald-500" />
    },
    {
        title: "2. Seed Derivation",
        description: "BIP-39 to Seed",
        content: "The mnemonic is converted into a 512-bit binary seed. This seed is the root from which all keys are derived.",
        code: `// lib/solana/derive.ts
const seed = bip39.mnemonicToSeedSync(mnemonic)
// Buffer<...512 bits...>`,
        icon: <Terminal className="w-10 h-10 text-blue-500" />
    },
    {
        title: "3. Keypair Derivation",
        description: "SLIP-0010 (Ed25519)",
        content: "We use the derivation path m/44'/501'/${index}'/0' to generate the Ed25519 private key and public key (address).",
        code: `// lib/solana/derive.ts
import { derivePath } from "ed25519-hd-key"
import nacl from "tweetnacl"

const path = "m/44'/501'/0'/0'"
const { key } = derivePath(path, seed.toString("hex"))
const keypair = nacl.sign.keyPair.fromSeed(key)

// Public Key: Sol...Address
// Private Key: [Secret...]`,
        icon: <Wallet className="w-10 h-10 text-purple-500" />
    }
]

// Content for API Endpoints
const API_DOCS = [
    {
        id: "balance",
        title: "Get Balance",
        endpoint: "/api/solana/balance",
        method: "GET",
        description: "Fetches the native SOL balance for a given address.",
        params: [
            { name: "address", type: "string", required: true, desc: "Wallet public key" },
            { name: "network", type: "string", required: false, desc: "mainnet | devnet | testnet" }
        ],
        code: `// app/api/solana/balance/route.ts
const result = await getRpc(network)
  .getBalance(address(pubkey))
  .send()

return NextResponse.json({
  balance: Number(result.value) / 1_000_000_000,
})`,
        response: `{
  "balance": 12.45
}`
    },
    {
        id: "history",
        title: "Transaction History",
        endpoint: "/api/solana/history",
        method: "GET",
        description: "Retrieves the last N transactions for a wallet address.",
        params: [
            { name: "address", type: "string", required: true, desc: "Wallet public key" },
            { name: "limit", type: "number", required: false, desc: "Default: 10" }
        ],
        code: `// app/api/solana/history/route.ts
const signatures = await getRpc(network)
  .getSignaturesForAddress(
    address(pubkey),
    { limit }
  )
  .send()`,
        response: `[
  {
    "signature": "5K...",
    "blockTime": 1678234,
    "success": true
  }
]`
    }
]

// Simple syntax highlighter component
const SyntaxHighlighter = ({ code }: { code: string }) => {
    const lines = code.split("\n")

    return (
        <code className="text-xs md:text-sm font-mono leading-relaxed block overflow-visible">
            {lines.map((line, i) => {
                // Regex for basic JS/TS highlighting
                const tokens = line.split(/(\/\/.*|['"`].*?['"`]|\b(?:const|let|var|function|export|import|from|await|async|return|try|catch|if|else|throw|new|string|number|boolean|any)\b|\b\d+(?:_\d+)*\b|(?:\.[a-zA-Z0-9_]+(?=\()))/g)

                return (
                    <div key={i} className="min-h-5 whitespace-pre">
                        {tokens.map((token, j) => {
                            if (!token) return null

                            // Comment
                            if (token.startsWith("//")) {
                                return <span key={j} className="text-muted-foreground/60 italic whitespace-pre-wrap wrap-break-word">{token}</span>
                            }
                            // String
                            if (/^['"`].*?['"`]$/.test(token)) {
                                return <span key={j} className="text-emerald-400">{token}</span>
                            }
                            // Keywords
                            if (/\b(const|let|var|function|export|import|from|await|async|return|try|catch|if|else|throw|new|string|number|boolean|any)\b/.test(token)) {
                                return <span key={j} className="text-purple-400 font-bold">{token}</span>
                            }
                            // Numbers
                            if (/\b\d+(?:_\d+)*\b/.test(token)) {
                                return <span key={j} className="text-orange-400">{token}</span>
                            }
                            // Methods (starting with .)
                            if (token.startsWith(".")) {
                                return <span key={j} className="text-blue-400 italic">{token}</span>
                            }

                            return <span key={j}>{token}</span>
                        })}
                    </div>
                )
            })}
        </code>
    )
}

export const HowItWorks = () => {
    const [step, setStep] = React.useState(0)

    // Auto-advance slider if user interacts? No, let them control it.

    return (
        <div className="w-full max-w-5xl mx-auto p-6 space-y-12">

            {/* Hero Section */}
            <section className="text-center space-y-4 py-10">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-600">
                    Velocity Architecture
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    A deep dive into how Velocity secures your assets and interacts with the Solana blockchain.
                    Non-custodial, transparent, and built on open standards.
                </p>
            </section>

            {/* Wallet Generation Slider */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight">Wallet Creation Process</h2>
                    <span className="text-sm text-muted-foreground">Step {step + 1} of 3</span>
                </div>

                <div className="relative">
                    <div className="mb-8 px-2">
                        <Slider
                            value={[step]}
                            max={2}
                            step={1}
                            onValueChange={(val) => setStep(Array.isArray(val) ? val[0] : val)}
                            className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                            <span>Mnemonic</span>
                            <span>Seed</span>
                            <span>Keypair</span>
                        </div>
                    </div>

                    <Card className="overflow-hidden border-2 transition-all duration-300">
                        <div className="p-6 md:p-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid md:grid-cols-2 gap-6"
                                >
                                    <div className="space-y-6 min-h-50">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-primary/10 rounded-xl">
                                                {WALLET_STEPS[step].icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">{WALLET_STEPS[step].title}</h3>
                                                <p className="text-sm text-muted-foreground">{WALLET_STEPS[step].description}</p>
                                            </div>
                                        </div>

                                        <p className="text-base leading-relaxed ">
                                            {WALLET_STEPS[step].content}
                                        </p>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                disabled={step === 0}
                                                onClick={() => setStep(s => Math.max(0, s - 1))}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                disabled={step === 2}
                                                onClick={() => setStep(s => Math.min(2, s + 1))}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="bg-muted/50 rounded-xl overflow-hidden relative group">
                                        <div className="absolute top-2 right-2 flex gap-1.5 z-10">
                                            <div className="w-3 h-3 rounded-full bg-red-400/20" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-400/20" />
                                            <div className="w-3 h-3 rounded-full bg-green-400/20" />
                                        </div>
                                        <ScrollArea className="h-50 w-full rounded-md">
                                            <div className="p-4 pt-8 ">
                                                <SyntaxHighlighter code={WALLET_STEPS[step].code} />
                                            </div>
                                        </ScrollArea>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </Card>
                </div>
            </section>

            <Separator className="my-10" />

            {/* API Architecture Grid */}
            <section className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">API Infrastructure</h2>
                        <p className="text-muted-foreground">Serverless functions interacting with Solana RPC nodes.</p>
                    </div>
                    {/* Documentation Sidebar Trigger */}
                    <Sheet>
                        <SheetTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                            System Overview <ChevronRight className="w-4 h-4" />
                        </SheetTrigger>
                        <SheetContent side="left" className="w-75 sm:w-100 p-4">
                            <SheetHeader>
                                <SheetTitle>System Architecture</SheetTitle>
                                <SheetDescription>
                                    High-level overview of the Velocity stack.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="py-6 space-y-6">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Frontend</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                                        <li>Next.js 16 App Router</li>
                                        <li>Tailwind CSS + Shadcn UI</li>
                                        <li>Framer Motion</li>
                                        <li>Lucide React Icons</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Blockchain</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                                        <li>@solana/kit</li>
                                        <li>BIP-39 & ed25519-hd-key</li>
                                        <li>tweetnacl & bs58</li>
                                        <li>Helius RPC Nodes</li>
                                    </ul>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {API_DOCS.map((doc) => (
                        <Sheet key={doc.id}>
                            <SheetTrigger className="text-left w-full">
                                <Card className="cursor-pointer hover:border-primary/50 transition-colors group min-h-37.5">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                {doc.id === 'balance' ? <CreditCard className="w-5 h-5" /> : <History className="w-5 h-5" />}
                                                {doc.title}
                                            </CardTitle>
                                            <Badge variant="outline" className="font-mono group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                {doc.method}
                                            </Badge>
                                        </div>
                                        <CardDescription className="font-mono text-xs text-left p-2">{doc.endpoint}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground text-left">{doc.description}</p>
                                    </CardContent>
                                </Card>
                            </SheetTrigger>
                            <SheetContent className="w-100 sm:w-135 flex flex-col px-2">
                                <SheetHeader className="mb-6">
                                    <SheetTitle className="flex items-center gap-2 text-xl">
                                        <span className="font-mono text-primary">GET</span> {doc.endpoint}
                                    </SheetTitle>
                                    <SheetDescription>
                                        {doc.description}
                                    </SheetDescription>
                                </SheetHeader>

                                <ScrollArea className="flex-1 -mx-6 px-6">
                                    <div className="space-y-6 pb-6">
                                        <div>
                                            <h4 className="text-sm font-medium mb-3">Query Parameters</h4>
                                            <div className="bg-muted/40 rounded-lg p-2 space-y-2">
                                                {doc.params.map(param => (
                                                    <div key={param.name} className="flex items-center justify-between text-sm p-2 hover:bg-muted rounded-md transition-colors">
                                                        <div className="flex items-center gap-2">
                                                            <code className="text-primary font-bold">{param.name}</code>
                                                            {param.required && <Badge variant="destructive" className="text-[10px] h-4 px-1">Req</Badge>}
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xs text-muted-foreground block">{param.type}</span>
                                                            <span className="text-xs opacity-70">{param.desc}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium mb-3">Server Implementation</h4>
                                            <div className="bg-zinc-950 text-zinc-50 rounded-lg overflow-hidden border border-zinc-800">
                                                <ScrollArea className="h-50 w-full">
                                                    <div className="p-4">
                                                        <SyntaxHighlighter code={doc.code} />
                                                    </div>
                                                </ScrollArea>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium mb-3">Response Example</h4>
                                            <div className="bg-muted rounded-lg overflow-hidden">
                                                <ScrollArea className="h-37.5 w-full">
                                                    <div className="p-4">
                                                        <SyntaxHighlighter code={doc.response} />
                                                    </div>
                                                </ScrollArea>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </SheetContent>
                        </Sheet>
                    ))}
                </div>
            </section>
        </div>
    )
}