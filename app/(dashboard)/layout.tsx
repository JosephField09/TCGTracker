import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import NavLink from "@/components/nav/NavLink";
import { getTriggeredAlertCount } from "@/app/actions/alerts";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const triggeredAlertCount = await getTriggeredAlertCount();

    return (
        <div className="min-h-screen bg-lavender">
            {/* Navbar */}
            <nav className="bg-white h-25 border-b border-wisteria flex items-center justify-around overflow-visible">
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
                    <NavLink
                        href="/profile"
                        label="Profile"
                        notificationCount={triggeredAlertCount}
                    />
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