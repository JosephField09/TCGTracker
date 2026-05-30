"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface NavLinkProps {
    href: string;
    label: string;
}

export default function NavLink({ href, label }: NavLinkProps) {
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
        </Link>
    );
}