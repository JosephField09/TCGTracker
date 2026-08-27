import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import NavLink from "@/components/nav/NavLink";
import { getTriggeredAlertCount } from "@/app/actions/alerts";

interface Props {
    isAuthenticated: boolean;
}

export default async function Header({ isAuthenticated }: Props) {
    const triggeredAlertCount = isAuthenticated ? await getTriggeredAlertCount() : 0;

    return (
        <nav className="bg-white h-25 border-b border-wisteria flex items-center justify-around overflow-visible">
            {/* Logo */}
            {isAuthenticated ? (
                <Link href="/dashboard" className="flex items-center no-underline">
                    <img src="/tcgt-logo.png" alt="Logo" className="h-10.5 w-10.5 aspect-square" />
                    <span className="text-midnight text-2xl font-bold font-sans">
                        TCGTracker
                    </span>
                </Link>
            ) : (
                <Link href="/" className="flex items-center no-underline">
                    <img src="/tcgt-logo.png" alt="Logo" className="h-10.5 w-10.5 aspect-square" />
                    <span className="text-midnight text-2xl font-bold font-sans">
                        TCGTracker
                    </span>
                </Link>
            )}
            {/* Navigation Links */}
            <div className="flex items-center gap-6">
                <NavLink href="/sets" label="Sets" />
                {isAuthenticated ? (
                    <>
                        <NavLink href="/dashboard" label="Dashboard" />
                        <NavLink
                            href="/profile"
                            label="Profile"
                            notificationCount={triggeredAlertCount}
                        />
                        <UserButton />
                    </>
                ) : (
                    <NavLink
                        href="/sign-in"
                        label="Sign In"
                    />
                )}
            </div>
        </nav>
    );
}
