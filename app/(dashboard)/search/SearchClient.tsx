"use client";

import { useState, useTransition, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { searchCards } from "@/lib/search";
import type { SearchResults, SearchCard } from "@/lib/search";
import { CollectionProvider } from "@/context/CollectionContext";
import SetCardItem from "@/components/cards/SetCardItem";
import { getLatestPricesForSet } from "@/app/actions/prices";
import type { TcgCardDetail } from "@/lib/tcgdex";

interface Props {
    filterOptions: {
        types: string[];
        rarities: string[];
        illustrators: string[];
    };
    ownedVariantMap: Record<string, Record<string, number>>;
}

const CATEGORIES = ["Pokemon", "Trainer", "Energy"];

export default function SearchClient({
    filterOptions,
    ownedVariantMap,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [results, setResults] = useState<SearchResults | null>(null);
    const [priceMap, setPriceMap] = useState<
        Record<string, { price: number; currency: string }>
    >({});
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    
    const query = searchParams.get("q") ?? "";
    const type = searchParams.get("type") ?? "";
    const rarity = searchParams.get("rarity") ?? "";
    const category = searchParams.get("category") ?? "";
    const illustrator = searchParams.get("illustrator") ?? "";
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const [queryInput, setQueryInput] = useState(query);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const hasSearched = query || type || rarity || category || illustrator;

    function setParam(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete("page");
        router.replace(`/search?${params.toString()}`, { scroll: false });
    }

    function setPage(p: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", p.toString());
        router.replace(`/search?${params.toString()}`, { scroll: false });
    }

    function handleReset() {
        router.replace("/search", { scroll: false });
        setResults(null);
    }

    const runSearch = useCallback(() => {
        if (!hasSearched) {
            setResults(null);
            return;
        }

        startTransition(async () => {
            const res = await searchCards({
                query: query || undefined,
                type: type || undefined,
                rarity: rarity || undefined,
                category: category || undefined,
                illustrator: illustrator || undefined,
                page,
            });
            setResults(res);

            if (res.cards.length > 0) {
                const prices = await getLatestPricesForSet(
                    res.cards.map((c) => c.id),
                );
                setPriceMap(prices);
            } else {
                setPriceMap({});
            }
        });
    }, [query, type, rarity, category, illustrator, page, hasSearched]);

    useEffect(() => {
        startTransition(() => setQueryInput(query));
    }, [query]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(runSearch, query ? 150 : 0);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, runSearch]);

    const hasFilters = type || rarity || category || illustrator;
    const activeFilterCount = [type, rarity, category, illustrator].filter(
        Boolean,
    ).length;

    function toggleMobileFilters() {
        setMobileFiltersOpen((open) => !open);
    }

    return (
        <CollectionProvider initialMap={ownedVariantMap}>
            <div className="space-y-5 w-11/12 lg:w-8/12 mx-auto">
                {/* Header */}
                <div>
                    <h1 className="font-display text-3xl font-bold text-dusk">
                        Search
                    </h1>
                </div>

                {/* Filter bar */}
                <div className="flex flex-wrap gap-3 items-center">
                    {/* Main search */}
                    <div className="flex flex-1 min-w-0 sm:flex-none items-center bg-white border border-wisteria rounded-lg px-3 py-2 gap-2 focus-within:border-violet transition-colors sm:w-72">
                        <svg
                            className="text-lilac shrink-0"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search cards, sets, illustrators..."
                            value={queryInput}
                            onChange={(e) => {
                                setQueryInput(e.target.value);
                                setParam("q", e.target.value);
                            }}
                            className="text-sm text-midnight placeholder:text-lilac outline-none bg-transparent w-full"
                        />
                        {query && (
                            <button
                                onClick={() => setParam("q", "")}
                                className="text-lilac hover:text-midnight transition-colors text-lg leading-none"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={toggleMobileFilters}
                        aria-expanded={mobileFiltersOpen}
                        className="lg:hidden inline-flex items-center justify-center gap-2 rounded-lg border border-wisteria bg-white px-3 py-2 text-sm text-midnight hover:border-violet transition-colors"
                    >
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <path d="M4 6h16M7 12h10M10 18h4" />
                        </svg>
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-violet px-1 text-xs text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {/* Type filter */}
                    <select
                        value={type}
                        onChange={(e) => {
                            setParam("type", e.target.value);
                        }}
                        className="hidden lg:block bg-white border border-wisteria rounded-lg px-3 py-2 text-sm text-midnight outline-none focus:border-violet transition-colors cursor-pointer w-full lg:w-auto"
                    >
                        <option value="">All types</option>
                        {filterOptions.types.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>

                    {/* Rarity filter */}
                    <select
                        value={rarity}
                        onChange={(e) => {
                            setParam("rarity", e.target.value)
                        }}
                        className="hidden lg:block bg-white border border-wisteria rounded-lg px-3 py-2 text-sm text-midnight outline-none focus:border-violet transition-colors cursor-pointer w-full lg:w-auto"
                    >
                        <option value="">All rarities</option>
                        {filterOptions.rarities.map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>

                    {/* Category filter */}
                    <select
                        value={category}
                        onChange={(e) => {
                            setParam("category", e.target.value);
                        }}
                        className="hidden lg:block bg-white border border-wisteria rounded-lg px-3 py-2 text-sm text-midnight outline-none focus:border-violet transition-colors cursor-pointer w-full lg:w-auto"
                    >
                        <option value="">All categories</option>
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>

                    {/* Illustrator filter */}
                    <select
                        value={illustrator}
                        onChange={(e) => {
                            setParam("illustrator", e.target.value)
                        }}
                        className="hidden lg:block bg-white border border-wisteria rounded-lg px-3 py-2 text-sm text-midnight outline-none focus:border-violet transition-colors cursor-pointer w-full lg:w-auto"
                    >
                        <option value="">All illustrators</option>
                        {filterOptions.illustrators.map((i) => (
                            <option key={i} value={i}>
                                {i}
                            </option>
                        ))}
                    </select>

                    {/* Reset */}
                    {(hasFilters || query) && (
                        <button
                            onClick={handleReset}
                            className="hidden lg:block text-sm text-heather hover:text-violet transition-colors"
                        >
                            Clear all
                        </button>
                    )}

                </div>

                <AnimatePresence initial={false}>
                    {mobileFiltersOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: -8 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -8 }}
                            transition={{ duration: 0.30, ease: "easeOut" }}
                            className="lg:hidden rounded-lg border border-wisteria bg-white p-4 space-y-3 overflow-hidden"
                        >
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-dusk">Filters</h2>
                            <button
                                type="button"
                                onClick={toggleMobileFilters}
                                className="text-sm text-heather hover:text-violet transition-colors"
                            >
                                Done
                            </button>
                        </div>

                        <label className="block space-y-1.5">
                            <span className="text-xs text-heather">Type</span>
                            <select
                                value={type}
                                onChange={(e) => setParam("type", e.target.value)}
                                className="w-full bg-white border border-wisteria rounded-lg px-3 py-2 text-sm text-midnight outline-none focus:border-violet transition-colors cursor-pointer"
                            >
                                <option value="">All types</option>
                                {filterOptions.types.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </label>

                        <label className="block space-y-1.5">
                            <span className="text-xs text-heather">Rarity</span>
                            <select
                                value={rarity}
                                onChange={(e) => setParam("rarity", e.target.value)}
                                className="w-full bg-white border border-wisteria rounded-lg px-3 py-2 text-sm text-midnight outline-none focus:border-violet transition-colors cursor-pointer"
                            >
                                <option value="">All rarities</option>
                                {filterOptions.rarities.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </label>

                        <label className="block space-y-1.5">
                            <span className="text-xs text-heather">Category</span>
                            <select
                                value={category}
                                onChange={(e) => setParam("category", e.target.value)}
                                className="w-full bg-white border border-wisteria rounded-lg px-3 py-2 text-sm text-midnight outline-none focus:border-violet transition-colors cursor-pointer"
                            >
                                <option value="">All categories</option>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </label>

                        <label className="block space-y-1.5">
                            <span className="text-xs text-heather">Illustrator</span>
                            <select
                                value={illustrator}
                                onChange={(e) => setParam("illustrator", e.target.value)}
                                className="w-full bg-white border border-wisteria rounded-lg px-3 py-2 text-sm text-midnight outline-none focus:border-violet transition-colors cursor-pointer"
                            >
                                <option value="">All illustrators</option>
                                {filterOptions.illustrators.map((i) => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                        </label>

                        {activeFilterCount > 0 && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="text-sm text-heather hover:text-violet transition-colors"
                            >
                                Clear all filters
                            </button>
                        )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {results && (
                    <div className="text-xs text-lilac">
                        {results.total.toLocaleString()} results
                    </div>
                )}

                {/* Results */}
                {!hasSearched ? (
                    <EmptyState />
                ) : isPending ? (
                    <SearchingState />
                ) : results && results.cards.length === 0 ? (
                    <NoResultsState query={query} />
                ) : results ? (
                    <>
                        <div
                            className={`grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 transition-opacity ${
                                isPending ? "opacity-50" : "opacity-100"
                            }`}
                        >
                            {results.cards.map((card) => (
                                <SearchCardItem
                                    key={card.id}
                                    card={card}
                                    priceMap={priceMap}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {results.totalPages > 1 && (
                            <Pagination
                                page={results.page}
                                totalPages={results.totalPages}
                                onPageChange={setPage}
                                isPending={isPending}
                            />
                        )}
                    </>
                ) : null}
            </div>
        </CollectionProvider>
    );
}

function SearchCardItem({
    card,
    priceMap,
}: {
    card: SearchCard;
    priceMap: Record<string, { price: number; currency: string }>;
}) {
    const priceData = priceMap[card.id];
    const adapted: TcgCardDetail = {
        ...card,
        image: card.image ?? undefined,
        rarity: card.rarity ?? undefined,
        illustrator: card.illustrator ?? undefined,
        category: card.category ?? undefined,
        variants: card.variants as TcgCardDetail["variants"],
        set: {
            ...card.set,
            logo: undefined,
            cardCount: { official: 0, total: 0 },
        },
        pricing: priceData
            ? {
                  cardmarket: {
                      trend: priceData.price,
                      avg: priceData.price,
                      low: priceData.price,
                      avg1: priceData.price,
                      avg7: priceData.price,
                      avg30: priceData.price,
                      updated: "",
                      unit: priceData.currency,
                  },
              }
            : undefined,
    };

    return <SetCardItem card={adapted} setId={card.setId} />;
}

function Pagination({
    page,
    totalPages,
    onPageChange,
    isPending,
}: {
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
    isPending: boolean;
}) {
    const getPageNumbers = () => {
        const pages: (number | "...")[] = [];

        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        pages.push(1);

        if (page > 3) pages.push("...");

        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);

        for (let i = start; i <= end; i++) pages.push(i);

        if (page < totalPages - 2) pages.push("...");

        pages.push(totalPages);

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 pt-4">
            {/* Prev */}
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1 || isPending}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-wisteria flex items-center justify-center text-heather hover:border-violet hover:text-violet disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                ←
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((p, i) =>
                p === "..." ? (
                    <span
                        key={`ellipsis-${i}`}
                        className="text-lilac text-sm px-0.5 sm:px-1"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p as number)}
                        disabled={isPending}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-sm font-medium transition-colors ${
                            p === page
                                ? "bg-violet text-white border border-violet"
                                : "border border-wisteria text-heather hover:border-violet hover:text-violet disabled:opacity-50"
                        }`}
                    >
                        {p}
                    </button>
                ),
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages || isPending}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-wisteria flex items-center justify-center text-heather hover:border-violet hover:text-violet disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                →
            </button>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-iris flex items-center justify-center mb-4">
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6C4FBF"
                    strokeWidth="2"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
            </div>
            <h2 className="font-display text-xl font-medium text-dusk mb-2">
                Search for any card
            </h2>
            <p className="text-heather text-sm max-w-xs leading-relaxed">
                Search by card name, set, illustrator — or use the filters to
                browse by type, rarity, or category.
            </p>
        </div>
    );
}

function SearchingState() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {Array.from({ length: 32 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white border border-wisteria rounded-xl overflow-hidden animate-pulse"
                >
                    <div className="aspect-2/3 bg-iris" />
                    <div className="p-2 space-y-1.5">
                        <div className="h-2.5 bg-iris rounded w-4/5" />
                        <div className="h-2 bg-iris rounded w-1/2" />
                        <div className="h-3 bg-iris rounded w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function NoResultsState({ query }: { query: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-iris flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
            </div>
            <h2 className="font-display text-xl font-medium text-dusk mb-2">
                No cards found
            </h2>
            <p className="text-heather text-sm max-w-xs">
                {query
                    ? `No results for "${query}". Try a different search term or adjust your filters.`
                    : "No cards match your filters. Try adjusting them."}
            </p>
        </div>
    );
}
