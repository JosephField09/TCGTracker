"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import NavLink from "@/components/nav/NavLink";

interface Props {
    isAuthenticated: boolean;
    triggeredAlertCount: number;
}

export default function MobileMenu({
    isAuthenticated,
    triggeredAlertCount,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    const panelVariants = {
        hidden: { opacity: 0, y: -10, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -8, scale: 0.98 },
    };
    return (
        <div className="relative lg:hidden">
            <button
                type="button"
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
                onClick={() => setIsOpen((open) => !open)}
                className="relative z-60 flex h-11 w-11 items-center justify-center rounded-lg text-midnight transition-colors hover:bg-lavender hover:text-violet"
            >
                <motion.span
                    animate={prefersReducedMotion ? undefined : { rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex"
                >
                    {isOpen ? <X size={25} strokeWidth={2} /> : <Menu size={25} strokeWidth={2} />}
                </motion.span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={prefersReducedMotion ? false : "hidden"}
                        animate="visible"
                        exit={prefersReducedMotion ? undefined : "exit"}
                        variants={panelVariants}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed right-0 top-0 z-50 w-56 origin-top-right overflow-hidden border border-wisteria bg-white shadow-xl"
                    >
                        <nav className="flex flex-col items-stretch gap-5 p-5 pt-20" aria-label="Mobile navigation">
                            <div onClick={() => setIsOpen(false)}>
                                <NavLink href="/search" label="Search" />
                            </div>
                            <div onClick={() => setIsOpen(false)}>
                                <NavLink href="/sets" label="Sets" />
                            </div>
                            {isAuthenticated ? (
                                <>
                                    <div onClick={() => setIsOpen(false)}>
                                        <NavLink href="/dashboard" label="Dashboard" />
                                    </div>
                                    <div onClick={() => setIsOpen(false)}>
                                        <NavLink
                                            href="/profile"
                                            label="Profile"
                                            notificationCount={triggeredAlertCount}
                                        />
                                    </div>
                                    <div className="border-t border-wisteria pt-4">
                                        <UserButton />
                                    </div>
                                </>
                            ) : (
                                <div onClick={() => setIsOpen(false)}>
                                    <NavLink href="/sign-in" label="Sign In" />
                                </div>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}