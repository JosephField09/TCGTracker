import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import NavLink from "@/components/nav/NavLink";
import { getTriggeredAlertCount } from "@/app/actions/alerts";
import NavSearch from "../nav/NavSearch";
import MobileMenu from "./MobileMenu";

interface Props {
    isAuthenticated: boolean;
}

export default async function Header({ isAuthenticated }: Props) {
    const triggeredAlertCount = isAuthenticated ? await getTriggeredAlertCount() : 0;

    return (
        <nav className="bg-white h-25 border-b border-wisteria overflow-visible">
            <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
                {/* Logo */}
                <Link
                    href={isAuthenticated ? "/dashboard" : "/"}
                    className="flex items-center no-underline"
                >
                    <img src="/tcgt-logo.png" alt="Logo" className="h-10.5 w-10.5 aspect-square" />
                    <span className="text-midnight text-2xl font-bold font-sans">
                        TCGTracker
                    </span>
                </Link>

                <NavSearch />

                {/* Navigation Links */}
                <div className="hidden items-center justify-end gap-3 lg:flex lg:gap-6">
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
                        <NavLink href="/sign-in" label="Sign In" />
                    )}
                </div>

                <MobileMenu
                    isAuthenticated={isAuthenticated}
                    triggeredAlertCount={triggeredAlertCount}
                />
            </div>
        </nav>
    );
}
