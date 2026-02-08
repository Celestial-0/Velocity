import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CiCreditCard2 } from "react-icons/ci";
import { CopyIcon, RefreshCWIcon } from "@/components/icon";
import type { SolanaWallet } from "@/lib/solana/types";

interface WalletInfoCardProps {
    wallet: SolanaWallet;
    balance: number | null;
    loading: boolean;
    loadWalletData: () => void;
    copyToClipboard: (text: string, label: string) => void;
    disconnect: () => void;
}

export const WalletInfoCard = ({
    wallet,
    balance,
    loading,
    loadWalletData,
    copyToClipboard,
    disconnect,
}: WalletInfoCardProps) => {
    return (
        <>
            <Card>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Public Key
                        </label>
                        <div className="flex items-center gap-2 p-2 rounded-md bg-muted font-mono text-xs break-all">
                            {wallet.publicKey}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-auto shrink-0"
                                onClick={() => copyToClipboard(wallet.publicKey, "Public Key")}
                            >
                                <CopyIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Private Key
                        </label>
                        <div className="flex items-center gap-2 p-2 rounded-md bg-muted font-mono text-xs break-all truncate">
                            <span className="truncate">{wallet.privateKey.slice(0, 20)}...</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-auto shrink-0"
                                onClick={() => copyToClipboard(wallet.privateKey, "Private Key")}
                            >
                                <CopyIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Mnemonic
                        </label>
                        <div className="p-3 rounded-md bg-muted/50 border relative group">
                            <p className="font-mono text-sm leading-relaxed blur-sm hover:blur-none transition-all duration-300">
                                {wallet.mnemonic}
                            </p>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => copyToClipboard(wallet.mnemonic, "Mnemonic")}
                            >
                                <CopyIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Hover to reveal seed phrase.</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Balance</CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={loadWalletData}
                            disabled={loading}
                            title="Refresh Balance"
                        >
                            <RefreshCWIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <CiCreditCard2 className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold">
                                    {loading && balance === null ? (
                                        <Skeleton className="h-8 w-24" />
                                    ) : (
                                        `${balance !== null ? balance : "0"} SOL`
                                    )}
                                </span>
                                <span className="text-xs text-muted-foreground">Available Balance</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button variant="outline" className="w-full text-destructive hover:text-destructive mt-auto" onClick={disconnect}>
                Disconnect Wallet
            </Button>
        </>
    );
};
