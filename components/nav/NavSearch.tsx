"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function NavSearch() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState("");
    const isOnSearchPage = pathname === "/search";

    // Sync with URL when on search page
    useEffect(() => {
        if (isOnSearchPage) {
            setValue(searchParams.get("q") ?? "");
        }
    }, [isOnSearchPage, searchParams]);

    // Global / shortcut
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (
                e.key === "/" &&
                document.activeElement?.tagName !== "INPUT" &&
                document.activeElement?.tagName !== "TEXTAREA"
            ) {
                e.preventDefault();
                inputRef.current?.focus();
            }
            if (e.key === "Escape") {
                inputRef.current?.blur();
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        setValue(val);

        if (isOnSearchPage) {
            // Update URL directly if already on search page
            const params = new URLSearchParams(searchParams.toString());
            if (val) {
                params.set("q", val);
            } else {
                params.delete("q");
            }
            params.delete("page");
            router.replace(`/search?${params.toString()}`, { scroll: false });
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && !isOnSearchPage) {
            // Navigate to search page with query
            const params = new URLSearchParams();
            if (value) params.set("q", value);
            router.push(`/search?${params.toString()}`);
        }
        if (e.key === "Escape") {
            inputRef.current?.blur();
        }
    }

    return (
        <div className="hidden md:flex items-center bg-lavender border-2 border-wisteria rounded-xl px-3 py-2 gap-2 w-64 focus-within:border-violet focus-within:bg-white focus-within:w-74 transition-all duration-200 group">
            <svg
                className="text-lilac group-focus-within:text-violet shrink-0 transition-colors"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>
            <input
                ref={inputRef}
                type="text"
                placeholder="Search cards..."
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="text-sm font-semibold font-sans text-midnight placeholder:text-lilac outline-none bg-transparent w-full"
            />
            {/* Keyboard hint — hidden when focused */}
            <kbd className="text-[10px] text-lilac bg-white border border-wisteria rounded px-1 py-0.5 font-mono group-focus-within:hidden shrink-0">
                /
            </kbd>
        </div>
    );
}
