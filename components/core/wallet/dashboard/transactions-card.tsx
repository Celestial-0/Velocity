import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { HistoryIcon } from "@/components/icon";
import type { WalletTransaction } from "@/lib/solana/types";

interface TransactionsCardProps {
    transactions: WalletTransaction[];
    loading: boolean;
    network: string;
}

export const TransactionsCard = ({
    transactions,
    loading,
    network,
}: TransactionsCardProps) => {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <Card className="flex flex-col h-full">
                <CardHeader className="shrink-0">
                    <CardTitle className="flex items-center gap-2">
                        <HistoryIcon size={20} className="h-5 w-5" />
                        Recent Activity
                    </CardTitle>
                    <CardDescription>
                        Your last 10 transactions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto min-h-0">
                    {loading && transactions.length === 0 ? (
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : transactions.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Signature</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((tx) => (
                                    <TableRow key={tx.signature}>
                                        <TableCell className="font-mono text-xs">
                                            <a
                                                href={`https://explorer.solana.com/tx/${tx.signature}${network === "devnet" ? "?cluster=devnet" : network === "testnet" ? "?cluster=testnet" : ""}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="hover:underline text-primary truncate max-w-[100px] block"
                                            >
                                                {tx.signature.slice(0, 8)}...
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={tx.success ? "default" : "destructive"}>
                                                {tx.success ? "Success" : "Failed"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">
                                            {tx.blockTime
                                                ? new Date(tx.blockTime * 1000).toLocaleDateString()
                                                : "—"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <HistoryIcon className="h-10 w-10 mb-2 opacity-20" />
                            <p>No transactions found.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
