import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { buttonVariants } from "@/components/ui/button"
import { EarthIcon } from "@/components/icon"
import { useNetwork } from "@/components/network-provider"
import { cn } from "@/lib/utils"

export const NetworkToggle = () => {
    const { network, setNetwork } = useNetwork();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}>
                <EarthIcon size ={16} />
                <span className="capitalize">{network}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setNetwork("mainnet")}>
                    Mainnet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setNetwork("devnet")}>
                    Devnet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setNetwork("testnet")}>
                    Testnet
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}