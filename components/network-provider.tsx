"use client";

import React, { createContext, useContext, useState } from "react";

export type Network = "mainnet" | "devnet" | "testnet";

interface NetworkContextType {
    network: Network;
    setNetwork: (network: Network) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
    const [network, setNetworkState] = useState<Network>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("velocity_network");
            if (stored === "mainnet" || stored === "devnet" || stored === "testnet") {
                return stored as Network;
            }
        }
        return "devnet";
    });

    const setNetwork = (n: Network) => {
        setNetworkState(n);
        localStorage.setItem("velocity_network", n);
    };

    return (
        <NetworkContext.Provider value={{ network, setNetwork }}>
            {children}
        </NetworkContext.Provider>
    );
}

export function useNetwork() {
    const context = useContext(NetworkContext);
    if (context === undefined) {
        throw new Error("useNetwork must be used within a NetworkProvider");
    }
    return context;
}
