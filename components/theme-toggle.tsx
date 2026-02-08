"use client"

import { useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ContrastIcon, type ContrastIconHandle } from "@/components/icon/contrast"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const iconRef = useRef<ContrastIconHandle>(null)

    useEffect(() => {
        if (theme === "dark") {
            iconRef.current?.startAnimation()
        } else {
            iconRef.current?.stopAnimation()
        }
    }, [theme])

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="group/toggle"
        >
            <ContrastIcon ref={iconRef} size={20} />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
