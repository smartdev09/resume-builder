import { auth } from "utils/auth";
import ThemeToggle from "@resume/ui/ThemeToggle";
import UserButton from "./UserButton";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { User } from 'lucide-react';

export default async function Navbar() {
    const session = await auth();
    
    // if(!session ?.user) redirect('/')
    return (
        <header className="shadow-sm">
            <div className="max-w-7xl mx-auto p-3 flex items-center justify-between gap-3">
                <div>
                <Link href="/resumes" className="flex items-center gap-2" >
                    <p className="text-sm text-bold">Resume Builder</p>
                </Link>
                <p className="text-xs">A free tool by <span className="text-primary text-bold text-md"><a href='https://usmansiddique.dev' target="_blank">Usman</a></span></p>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    {session ? <UserButton user={session?.user}/> :  (
                        <User />
                    )}
                </div>
            </div>
        </header>
    )
}