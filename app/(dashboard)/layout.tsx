import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import NavLink from "@/components/nav/NavLink";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-lavender">
            {/* Navbar */}
            <nav className="bg-white h-25 border-b border-wisteria flex items-center justify-around">
                {/* Logo */}
                <Link href="/" className="flex items-center no-underline">
                    <img src="/tcgt-logo.png" alt="Logo" className="h-10.5 w-10.5 aspect-square" />
                    <span className="text-midnight text-2xl font-bold font-sans">
                        TCGTracker
                    </span>
                </Link>
                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                    <NavLink href="/sets" label="Sets" />
                    <NavLink href="/dashboard" label="Dashboard" />
                    <NavLink href="/profile" label="Profile" />
                    <UserButton afterSignOutUrl="/" />
                </div>
            </nav>
            {/* Main Content */}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}