"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface NavLinkProps {
    href: string;
    label: string;
    notificationCount?: number;
}

export default function NavLink({ href, label, notificationCount = 0 }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href || pathname.startsWith(href + "/");

    return (
        <Link
            href={href}
            className={`relative pb-1 text-sm transition-colors duration-200 no-underline ${
                isActive 
                    ? "text-violet text-[24px] font-sans font-bold"
                    : "text-midnight text-[24px] font-sans font-bold hover:text-amethyst"
            }`}
            >
                {label}
                {isActive && (
                    <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-violet"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                )}
                {notificationCount > 0 && (
                    <span className="pointer-events-none absolute right-0 top-0 z-10 flex h-4 min-w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-price-down px-1 text-[10px] font-bold leading-none text-white">
                        {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                )}
        </Link>
    );
}