"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const footerSections = [
    {
        title: "Useful Links",
        links: [
            { label: "About Us", href: "/" },
            { label: "Announcements", href: "/" },
            { label: "Privacy Policy", href: "/" },
            { label: "Manage Consent", href: "/" },
        ],
    },
    {
        title: "Community",
        links: [
            { label: "Streamers", href: "/" },
            { label: "Facebook Groups", href: "/" },
            { label: "Discord Server", href: "/" },
        ],
    },
    {
        title: "Contact Us",
        links: [
            { label: "Email", href: "mailto:hello@tcgtracker.app" },
            { label: "Facebook", href: "https://www.facebook.com/" },
            { label: "Instagram", href: "https://www.instagram.com/" },
            { label: "Twitter / X", href: "http://x.com/" },
        ],
    },
];

export default function Footer() {
    const [openSection, setOpenSection] = useState<string | null>(null);

    return (
        <footer className="bg-white border-t border-wisteria mt-16">
            <div className="space-y-5 w-10/12 lg:w-8/12 mx-auto py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl font-bold text-midnight font-sans">
                                TCGTracker
                            </span>
                        </div>
                    </div>

                    {footerSections.map(({ title, links }) => {
                        const isOpen = openSection === title;
                        const renderLinks = () => links.map(({ label, href }) => {
                            const isExternal = href.startsWith("http");
                            const className = "block text-l text-heather hover:text-violet transition-colors no-underline";

                            return isExternal ? (
                                <a key={label} href={href} className={className}>
                                    {label}
                                </a>
                            ) : (
                                <Link key={label} href={href} className={className}>
                                    {label}
                                </Link>
                            );
                        });

                        return (
                            <div key={title} className="col-span-2 md:col-span-1">
                                <button
                                    type="button"
                                    aria-expanded={isOpen}
                                    onClick={() => setOpenSection(isOpen ? null : title)}
                                    className="flex w-full items-center justify-between text-left text-xl font-bold tracking-wider text-midnight md:pointer-events-none"
                                >
                                    {title}
                                    <ChevronDown
                                        aria-hidden="true"
                                        className={`h-5 w-5 transition-transform duration-200 md:hidden ${
                                            isOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>
                                <div className="md:hidden">
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0, y: -8 }}
                                                animate={{ height: "auto", opacity: 1, y: 0 }}
                                                exit={{ height: 0, opacity: 0, y: -8 }}
                                                transition={{ duration: 0.22, ease: "easeOut" }}
                                                className="mt-3 space-y-2 overflow-hidden"
                                            >
                                                {renderLinks()}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="mt-3 hidden space-y-2 md:block">
                                    {renderLinks()}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-wisteria mt-8 pt-6 flex items-center justify-between">
                    <p className="text-xs text-lilac">
                        © {new Date().getFullYear()} TCGTracker. All rights
                        reserved.
                    </p>
                    <p className="text-xs text-lilac">
                        Pokémon and all related names are trademarks of Nintendo
                        / Creatures Inc. / GAME FREAK Inc.
                    </p>
                </div>
            </div>
        </footer>
    );
}
