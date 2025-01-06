'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@resume/ui/dropdown-menu";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "./ui/button";

export default function ThemeToggle() {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Sun className="size-[1.2rem] rotate-0p scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="size-[1.2rem] absolute rotate-90 scale-0 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>System </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}