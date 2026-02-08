"use client";

import { useState, useEffect, useCallback, Activity } from "react";
import { useNetwork } from "@/components/network-provider";
import { toast } from "sonner";
import type { SolanaWallet, WalletTransaction } from "@/lib/solana/types";
import { generateSolanaWallet, restoreSolanaWallet } from "@/lib/solana/derive";
import { Hero } from "./hero";
import { DashboardView } from "./dashboard";
import { AuthView } from "./auth-view";

export const Wallet = () => {
    const [wallets, setWallets] = useState<SolanaWallet[]>([]);
    const [activeWalletIndex, setActiveWalletIndex] = useState(0);
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [loading, setLoading] = useState(false);
    const { network } = useNetwork();

    // AuthView state
    const [activeTab, setActiveTab] = useState("create");
    const [mnemonicInput, setMnemonicInput] = useState("");
    const [error, setError] = useState<string | null>(null);

    const activeWallet = wallets[activeWalletIndex] || null;

    // Load wallets from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("solana-wallets");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setWallets(parsed);
            } catch (err) {
                console.error("Failed to parse stored wallets:", err);
            }
        }
    }, []);

    // Save wallets to localStorage whenever they change
    useEffect(() => {
        if (wallets.length > 0) {
            localStorage.setItem("solana-wallets", JSON.stringify(wallets));
        }
    }, [wallets]);

    const loadWalletData = useCallback(async () => {
        if (!activeWallet) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/solana/balance?address=${activeWallet.publicKey}&network=${network}`);
            const balanceData = await response.json();

            const txResponse = await fetch(`/api/solana/history?address=${activeWallet.publicKey}&network=${network}`);
            const txData = await txResponse.json();

            setBalance(balanceData.balance);
            setTransactions(txData.transactions || []);
        } catch (error) {
            console.error("Error loading wallet data:", error);
            toast.error("Failed to load wallet data");
        } finally {
            setLoading(false);
        }
    }, [activeWallet, network]);

    // Load wallet data when active wallet changes
    useEffect(() => {
        if (activeWallet) {
            loadWalletData();
        }
    }, [activeWallet, loadWalletData]);

    const handleCreateWallet = () => {
        try {
            const newWallet = generateSolanaWallet();
            setWallets((prev) => [...prev, newWallet]);
            setActiveWalletIndex(wallets.length);
            setError(null);
            toast.success("Wallet created successfully!");
        } catch (err) {
            console.error(err);
            const errorMsg = "Failed to create wallet";
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    const handleRestoreWallet = () => {
        try {
            if (!mnemonicInput.trim()) {
                setError("Please enter a seed phrase");
                return;
            }
            const restoredWallet = restoreSolanaWallet(mnemonicInput.trim());
            setWallets((prev) => [...prev, restoredWallet]);
            setActiveWalletIndex(wallets.length);
            setMnemonicInput("");
            setError(null);
            toast.success("Wallet restored successfully!");
        } catch (err) {
            console.error(err);
            const errorMsg = "Failed to restore wallet. Please check your seed phrase.";
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    const handleSwitchAccount = (index: number) => {
        setActiveWalletIndex(index);
        toast.success(`Switched to ${wallets[index].label || `Account ${index + 1}`}`);
    };

    const handleAddAccount = (label?: string) => {
        try {
            const newWallet = generateSolanaWallet();
            if (label) {
                newWallet.label = label;
            }
            setWallets((prev) => [...prev, newWallet]);
            setActiveWalletIndex(wallets.length);
            toast.success("Account added successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to add account");
        }
    };

    const handleRenameAccount = (index: number, label: string) => {
        setWallets((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], label };
            return updated;
        });
        toast.success("Account renamed successfully!");
    };

    const handleDeleteAccount = (index: number) => {
        if (wallets.length === 1) {
            toast.error("Cannot delete the last account");
            return;
        }
        setWallets((prev) => prev.filter((_, i) => i !== index));
        if (activeWalletIndex >= index && activeWalletIndex > 0) {
            setActiveWalletIndex(activeWalletIndex - 1);
        }
        toast.success("Account deleted successfully!");
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
    };

    const disconnect = () => {
        setWallets([]);
        setActiveWalletIndex(0);
        setBalance(null);
        setTransactions([]);
        localStorage.removeItem("solana-wallets");
        toast.success("Wallet disconnected");
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Activity mode={!activeWallet ? "visible" : "hidden"}>
                <Hero />
            </Activity>

            <Activity mode={!activeWallet ? "visible" : "hidden"}>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <AuthView
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        mnemonicInput={mnemonicInput}
                        setMnemonicInput={setMnemonicInput}
                        handleCreateWallet={handleCreateWallet}
                        handleRestoreWallet={handleRestoreWallet}
                        error={error}
                    />
                </div>
            </Activity>

            <Activity mode={activeWallet ? "visible" : "hidden"}>
                <DashboardView
                    wallet={activeWallet}
                    wallets={wallets}
                    activeWalletIndex={activeWalletIndex}
                    onSwitchAccount={handleSwitchAccount}
                    onAddAccount={handleAddAccount}
                    onRenameAccount={handleRenameAccount}
                    onDeleteAccount={handleDeleteAccount}
                    balance={balance}
                    transactions={transactions}
                    loading={loading}
                    loadWalletData={loadWalletData}
                    copyToClipboard={copyToClipboard}
                    disconnect={disconnect}
                    network={network}
                />
            </Activity>
        </div>
    );
};
