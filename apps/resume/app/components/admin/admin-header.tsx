"use client";

import { User } from "next-auth";
import Image from "next/image";
import { Button } from "@resume/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@resume/ui/dropdown-menu";
import { Moon, Sun, LogOut, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";

interface AdminHeaderProps {
  user: User;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const getInitials = (name: string | null) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Manage your platform settings and users
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
              <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {user.image ? (
                  <Image 
                    src={user.image} 
                    alt={user.name || ""} 
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  getInitials(user?.name || "")
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 