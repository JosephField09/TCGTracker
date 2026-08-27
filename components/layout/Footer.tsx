import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-wisteria mt-16">
            <div className="space-y-5 w-8/12 mx-auto py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl font-bold text-midnight font-sans">
                                TCGTracker
                            </span>
                        </div>
                    </div>

                    {/* Useful links */}
                    <div>
                        <p className="text-xl font-bold text-midnight tracking-wider mb-3">
                            Useful Links
                        </p>
                        <div className="space-y-2">
                            {[
                                { label: "About Us", href: "/" },
                                { label: "Announcements", href: "/" },
                                { label: "Privacy Policy", href: "/" },
                                { label: "Manage Consent", href: "/" },
                            ].map(({ label, href }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className="block text-l text-heather hover:text-violet transition-colors no-underline"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Community */}
                    <div>
                        <p className="text-xl font-bold text-midnight tracking-wider mb-3">
                            Community
                        </p>
                        <div className="space-y-2">
                            {[
                                { label: "Streamers", href: "/" },
                                { label: "Facebook Groups", href: "/" },
                                { label: "Discord Server", href: "/" },
                            ].map(({ label, href }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className="block text-l text-heather hover:text-violet transition-colors no-underline"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="text-xl font-bold text-midnight tracking-wider mb-3">
                            Contact Us
                        </p>
                        <div className="space-y-2">
                            {[
                                {
                                    label: "Email",
                                    href: "mailto:hello@tcgtracker.app",
                                },
                                { label: "Facebook", href: "https://www.facebook.com/" },
                                { label: "Instagram", href: "https://www.instagram.com/" },
                                { label: "Twitter / X", href: "http://x.com/" },
                            ].map(({ label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    className="block text-l text-heather hover:text-violet transition-colors no-underline"
                                >
                                    {label}
                                </a>
                            ))}
                        </div>
                    </div>
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
