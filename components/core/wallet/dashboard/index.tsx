"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import type { SolanaWallet, WalletTransaction } from "@/lib/solana/types";
import { WalletInfoCard } from "@/components/core/wallet/dashboard/wallet-info-card";
import { TransactionsCard } from "@/components/core/wallet/dashboard/transactions-card";
import { AccountManagement } from "@/components/core/wallet/dashboard/account-management";

export interface DashboardViewProps {
    wallet: SolanaWallet | null;
    wallets: SolanaWallet[];
    activeWalletIndex: number;
    onSwitchAccount: (index: number) => void;
    onAddAccount: (label?: string) => void;
    onRenameAccount: (index: number, label: string) => void;
    onDeleteAccount: (index: number) => void;
    balance: number | null;
    transactions: WalletTransaction[];
    loading: boolean;
    loadWalletData: () => void;
    copyToClipboard: (text: string, label: string) => void;
    disconnect: () => void;
    network: string;
}

export const DashboardView = ({
    wallet,
    wallets,
    activeWalletIndex,
    onSwitchAccount,
    onAddAccount,
    onRenameAccount,
    onDeleteAccount,
    balance,
    transactions,
    loading,
    loadWalletData,
    copyToClipboard,
    disconnect,
    network,
}: DashboardViewProps) => {
    if (!wallet) return null;

    return (
        <div className="flex flex-col gap-2 max-w-4xl mx-auto pt-0">
            <div className="flex flex-col space-y-1 pb-0">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2 flex-1 min-h-0">
                {/* Wallet Details Column */}
                <div className="space-y-6 flex flex-col overflow-y-auto">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-0">
                            <div className="flex flex-col">
                                <CardTitle>Wallet Details</CardTitle>
                                <CardDescription>
                                    Your local wallet.
                                </CardDescription>
                            </div>
                            <AccountManagement
                                wallet={wallet}
                                wallets={wallets}
                                activeWalletIndex={activeWalletIndex}
                                onSwitchAccount={onSwitchAccount}
                                onAddAccount={onAddAccount}
                                onRenameAccount={onRenameAccount}
                                onDeleteAccount={onDeleteAccount}
                            />
                        </CardHeader>
                    </Card>
                    <WalletInfoCard
                        wallet={wallet}
                        balance={balance}
                        loading={loading}
                        loadWalletData={loadWalletData}
                        copyToClipboard={copyToClipboard}
                        disconnect={disconnect}
                    />
                </div>

                {/* Transactions Column */}
                <TransactionsCard
                    transactions={transactions}
                    loading={loading}
                    network={network}
                />
            </div>
        </div>
    );
};
