"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IoWallet } from "react-icons/io5";
import { BadgeAlertIcon } from "@/components/icon";

export interface AuthViewProps {
    activeTab: string;
    setActiveTab: (val: string) => void;
    mnemonicInput: string;
    setMnemonicInput: (val: string) => void;
    handleCreateWallet: () => void;
    handleRestoreWallet: () => void;
    error: string | null;
}

export const AuthView = ({
    activeTab,
    setActiveTab,
    mnemonicInput,
    setMnemonicInput,
    handleCreateWallet,
    handleRestoreWallet,
    error,
}: AuthViewProps) => {
    return (
        <div className="w-full max-w-md mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="create">Create Wallet</TabsTrigger>
                    <TabsTrigger value="restore">Restore Wallet</TabsTrigger>
                </TabsList>

                <TabsContent value="create">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Wallet</CardTitle>
                            <CardDescription>
                                Generate a new 12-word seed phrase to start using Solana.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-lg border border-dashed">
                                <IoWallet className="h-10 w-10 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground text-center">
                                    A new secure wallet will be generated locally.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={handleCreateWallet}>
                                Generate Wallet
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="restore">
                    <Card>
                        <CardHeader>
                            <CardTitle>Restore Wallet</CardTitle>
                            <CardDescription>
                                Enter your 12-word seed phrase to access your existing wallet.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Textarea
                                placeholder="Enter your seed phrase..."
                                className="min-h-[100px]"
                                value={mnemonicInput}
                                onChange={(e) => setMnemonicInput(e.target.value)}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" className="w-full" onClick={handleRestoreWallet}>
                                Restore Wallet
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

            {error && (
                <Alert variant="destructive" className="mt-4">
                    <BadgeAlertIcon className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
};
