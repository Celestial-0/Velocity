"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings2 } from "lucide-react";
import { CiSquareCheck } from "react-icons/ci";
import { FaPencil } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import type { SolanaWallet } from "@/lib/solana/types";

interface FormProps {
    value: string;
    onChange: (val: string) => void;
    onSubmit: () => void;
    label: string;
    placeholder: string;
    id: string;
}

const AccountForm = ({ value, onChange, onSubmit, label, placeholder, id }: FormProps) => (
    <div className="grid w-full items-center gap-1.5 pt-4 md:pt-0">
        <Label htmlFor={id}>{label}</Label>
        <Input
            type="text"
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') onSubmit();
            }}
            autoFocus
        />
    </div>
);

interface AccountManagementProps {
    wallet: SolanaWallet;
    wallets: SolanaWallet[];
    activeWalletIndex: number;
    onSwitchAccount: (index: number) => void;
    onAddAccount: (label?: string) => void;
    onRenameAccount: (index: number, label: string) => void;
    onDeleteAccount: (index: number) => void;
}

export const AccountManagement = ({
    wallet,
    wallets,
    activeWalletIndex,
    onSwitchAccount,
    onAddAccount,
    onRenameAccount,
    onDeleteAccount,
}: AccountManagementProps) => {
    const isMobile = useIsMobile();

    // Diagnostic log
    useEffect(() => {
        console.log("Environment check - isMobile:", isMobile);
    }, [isMobile]);

    const [opencombobox, setOpencombobox] = useState(false);
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
    const [isRenameDrawerOpen, setIsRenameDrawerOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [newAccountName, setNewAccountName] = useState("");
    const [renameAccountName, setRenameAccountName] = useState("");
    const [renameAccountIndex, setRenameAccountIndex] = useState<number | null>(null);
    const [deleteAccountIndex, setDeleteAccountIndex] = useState<number | null>(null);
    const [isManageAccountsOpen, setIsManageAccountsOpen] = useState(false);

    const handleCreateAccount = () => {
        onAddAccount(newAccountName || undefined);
        setNewAccountName("");
        setIsCreateDrawerOpen(false);
        setOpencombobox(false);
    };

    const handleRenameAccount = () => {
        if (renameAccountIndex !== null) {
            onRenameAccount(renameAccountIndex, renameAccountName);
            setRenameAccountName("");
            setRenameAccountIndex(null);
            setIsRenameDrawerOpen(false);
            setOpencombobox(false);
        }
    };

    const handleDeleteAccount = () => {
        if (deleteAccountIndex !== null) {
            onDeleteAccount(deleteAccountIndex);
            setDeleteAccountIndex(null);
            setIsDeleteDialogOpen(false);
            setOpencombobox(false);
        }
    };

    return (
        <>
            {/* Account Switcher Popover */}
            <Popover open={opencombobox} onOpenChange={setOpencombobox}>
                <PopoverTrigger
                    role="combobox"
                    aria-expanded={opencombobox}
                    className={cn(buttonVariants({ variant: "outline" }), "w-[200px] justify-between")}
                >
                    <span className="truncate">
                        {wallet.label || `Account ${activeWalletIndex + 1}`}
                    </span>
                    <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50 rotate-45" />
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0">
                    <Command>
                        <CommandList>
                            <CommandGroup heading="Switch Account">
                                {wallets.map((w, i) => (
                                    <CommandItem
                                        key={`${w.publicKey}-${i}`}
                                        value={w.publicKey + w.label}
                                        onSelect={() => {
                                            onSwitchAccount(i);
                                            setOpencombobox(false);
                                        }}
                                    >
                                        <CiSquareCheck
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                activeWalletIndex === i ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <span className="truncate flex-1 text-left">
                                            {w.label || `Account ${i + 1}`}
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            <CommandGroup heading="Actions">
                                <CommandItem
                                    onSelect={() => {
                                        setIsManageAccountsOpen(true);
                                        setOpencombobox(false);
                                    }}
                                >
                                    <Settings2 className="mr-2 h-4 w-4" />
                                    Manage Accounts
                                </CommandItem>
                                <CommandItem
                                    onSelect={() => {
                                        setIsCreateDrawerOpen(true);
                                        setOpencombobox(false);
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Account
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Responsive Create Account UI */}
            {isMobile ? (
                <Drawer open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
                    <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                                <DrawerTitle>Create New Account</DrawerTitle>
                                <DrawerDescription>Enter a name for your new wallet account.</DrawerDescription>
                            </DrawerHeader>
                            <div className="px-4">
                                <AccountForm
                                    id="create-name-drawer"
                                    label="Name"
                                    placeholder="My Trading Account"
                                    value={newAccountName}
                                    onChange={setNewAccountName}
                                    onSubmit={handleCreateAccount}
                                />
                            </div>
                            <DrawerFooter>
                                <Button onClick={handleCreateAccount}>Create Account</Button>
                                <DrawerClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            ) : (
                <Dialog open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Account</DialogTitle>
                            <DialogDescription>Enter a name for your new wallet account.</DialogDescription>
                        </DialogHeader>
                        <AccountForm
                            id="create-name-dialog"
                            label="Name"
                            placeholder="My Trading Account"
                            value={newAccountName}
                            onChange={setNewAccountName}
                            onSubmit={handleCreateAccount}
                        />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateDrawerOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateAccount}>Create Account</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Responsive Rename UI */}
            {isMobile ? (
                <Drawer open={isRenameDrawerOpen} onOpenChange={setIsRenameDrawerOpen}>
                    <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                                <DrawerTitle>Rename Account</DrawerTitle>
                                <DrawerDescription>Enter a new name for your account.</DrawerDescription>
                            </DrawerHeader>
                            <div className="px-4">
                                <AccountForm
                                    id="rename-name-drawer"
                                    label="Name"
                                    placeholder="Account Name"
                                    value={renameAccountName}
                                    onChange={setRenameAccountName}
                                    onSubmit={handleRenameAccount}
                                />
                            </div>
                            <DrawerFooter>
                                <Button onClick={handleRenameAccount}>Save Changes</Button>
                                <DrawerClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            ) : (
                <Dialog open={isRenameDrawerOpen} onOpenChange={setIsRenameDrawerOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Rename Account</DialogTitle>
                            <DialogDescription>Enter a new name for your account.</DialogDescription>
                        </DialogHeader>
                        <AccountForm
                            id="rename-name-dialog"
                            label="Name"
                            placeholder="Account Name"
                            value={renameAccountName}
                            onChange={setRenameAccountName}
                            onSubmit={handleRenameAccount}
                        />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsRenameDrawerOpen(false)}>Cancel</Button>
                            <Button onClick={handleRenameAccount}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Account Management Sheet */}
            <Sheet open={isManageAccountsOpen} onOpenChange={setIsManageAccountsOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md mr-2">
                    <SheetHeader>
                        <SheetTitle>Manage Accounts</SheetTitle>
                        <SheetDescription>
                            Rename or delete your wallet accounts
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-3">
                        {wallets.map((w, i) => (
                            <Card key={`${w.publicKey}-${i}`} className={cn(
                                "relative",
                                activeWalletIndex === i && "ring-2 ring-primary"
                            )}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium text-sm truncate">
                                                    {w.label || `Account ${i + 1}`}
                                                </h4>
                                                {activeWalletIndex === i && (
                                                    <Badge variant="default" className="text-xs">Active</Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground font-mono truncate">
                                                {w.publicKey.slice(0, 20)}...
                                            </p>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => {
                                                    setRenameAccountIndex(i);
                                                    setRenameAccountName(w.label || `Account ${i + 1}`);
                                                    setIsRenameDrawerOpen(true);
                                                    setIsManageAccountsOpen(false);
                                                }}
                                                title="Rename account"
                                            >
                                                <FaPencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                onClick={() => {
                                                    setDeleteAccountIndex(i);
                                                    setIsDeleteDialogOpen(true);
                                                    setIsManageAccountsOpen(false);
                                                }}
                                                title="Delete account"
                                                disabled={wallets.length === 1}
                                            >
                                                <FaTrashAlt className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="mt-6">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                setIsCreateDrawerOpen(true);
                                setIsManageAccountsOpen(false);
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Account
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the account
                            <span className="font-bold"> {deleteAccountIndex !== null ? (wallets[deleteAccountIndex]?.label || `Account ${deleteAccountIndex + 1}`) : ''}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete Account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
