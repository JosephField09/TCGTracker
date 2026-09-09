"use client";

import { useState, useMemo } from "react";
import { TcgCardDetail, TcgSetDetail } from "@/lib/tcgdex";
import Link from "next/link";
import RarityBadge from "@/components/badges/RarityBadge";
import SetCardItem from "@/components/cards/SetCardItem";
import { CollectionProvider } from "@/context/CollectionContext";

interface Props{
    set: TcgSetDetail & { cards: TcgCardDetail[] };
    ownedVariantMap: Record<string, Record<string, number>>;
}

const FILTERS = ["All", "Owned", "Missing"] as const;
type Filter = typeof FILTERS[number];

export default function SetClient({ set, ownedVariantMap  }: Props) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<Filter>("All");

    const rarityCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        set.cards.forEach((card) => {
            const r = (card as TcgCardDetail).rarity ?? "Unknown";
            counts[r] = (counts[r] ?? 0) + 1;
        });
        return counts;
    }, [set.cards]);

    const filteredCards = useMemo(() => {
        return set.cards.filter((card) => {
            const matchesSearch =
            card.name.toLowerCase().includes(search.toLowerCase()) ||
            card.localId.includes(search);

            const isOwned = Object.values(ownedVariantMap[card.id] ?? {}).some(
            (q) => q > 0
            );
            const matchesFilter =
            filter === "All" ||
            (filter === "Owned" && isOwned) ||
            (filter === "Missing" && !isOwned);

            return matchesSearch && matchesFilter;
        });
    }, [set.cards, search, filter, ownedVariantMap]);

    const owned = set.cards.filter(
        (card) => Object.values(ownedVariantMap[card.id] ?? {}).some((q) => q > 0)
    ).length;

    const total = set.cardCount.official;
    const percentage = total > 0 ? ((owned / total) * 100).toFixed(1) : "0.0";
    const totalValue = set.cards.reduce((sum, card) => {
        const pricing = (card as TcgCardDetail & {
            pricing?: {
                cardmarket?: {
                    averageSellPrice?: number;
                    avg?: number;
                    trend?: number;
                    unitPrice?: number;
                };
            };
        }).pricing?.cardmarket;

        return sum + (pricing?.averageSellPrice ?? pricing?.avg ?? pricing?.trend ?? pricing?.unitPrice ?? 0);
    }, 0);

    return (
        <CollectionProvider initialMap={ownedVariantMap}>
            <div className="mx-auto w-11/12 min-w-0 space-y-5 lg:w-8/12">
                {/* Breadcrumb */}
                <div className="flex min-w-0 gap-2 items-center text-sm">
                    <Link href="/sets" className="text-lilac hover:text-violet transition-colors no-underline">
                        Sets
                    </Link>
                    <span className="text-lilac">/</span>
                    <span className="min-w-0 truncate text-amethyst font-medium">{set.name}</span>
                </div>

                {/* Set Header */}
                <div className="bg-white border border-wisteria rounded-2xl p-4 lg:p-6 lg:pl-10 lg:pr-10 flex flex-col lg:flex-row items-center gap-3 lg:gap-6">
                    <div className="h-20 w-full lg:h-24 lg:w-32 flex items-center justify-center shrink-0">
                        {set.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={`${set.logo}.png`} alt={set.name} className="max-h-16 max-w-full object-contain"/>
                        ) : ( 
                            <div className="h-16 w-32 bg-lavender rounded-xl flex items-center justify-center text-lilac text-xs">
                                No Logo
                            </div>
                        )}
                    </div>
                    <div className="w-full min-w-0 text-center lg:flex-1 lg:text-left">
                        <h1 className="font-display text-2xl text-midnight font-bold">{set.name}</h1>
                        <p className="text-heather text-xs md:text-sm mt-1 font-medium leading-relaxed">
                            Released{" "}
                            {set.releaseDate
                            ? new Date(set.releaseDate).toLocaleDateString("en-GB", {
                                month: "long",
                                year: "numeric",
                                })
                            : "Unknown"}{" "} 
                            · {set.serie?.name} Series
                            · {set.cardCount.official} cards
                        </p>
                    </div>
                    <div className="grid w-full grid-cols-4 gap-2 lg:flex lg:w-auto lg:gap-8 shrink-0 px-1">
                        <div className="text-center">
                            <p className="text-sm md:text-xl lg:text-2xl font-medium text-midnight">{set.cardCount.official}</p>
                            <p className="text-xs text-lilac mt-0.5">Total cards</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm md:text-xl lg:text-2xl font-medium text-violet">{owned}</p>
                            <p className="text-xs text-lilac mt-0.5">Owned cards</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm md:text-xl lg:text-2xl font-medium text-price-down">{total - owned}</p>
                            <p className="text-xs text-lilac mt-0.5">Missing</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm md:text-xl lg:text-2xl font-medium text-gold">£{totalValue.toFixed(2)}</p>
                            <p className="text-xs text-lilac mt-0.5">Estimated Value</p>
                        </div>
                    </div>
                </div>

                {/* Set Progress */}
                <div className="bg-white border border-wisteria rounded-2xl p-4 md:p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <p className="text-xl text-center md:text-left md:text-3xl font-medium text-violet">{percentage}%</p>
                            <p className="text-xs md:text-sm text-heather mt-0.5">Set complete</p>
                        </div>
                        <div className="flex-1 h-3 bg-iris rounded-full overflow-hidden">
                            <div
                                className="h-full bg-violet rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(rarityCounts).map(([rarity]) => (
                            <RarityBadge key={rarity} rarity={rarity} className="text-xs md:text-sm" />
                        ))}
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <input
                        type="text"
                        placeholder="Search in this set..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border border-wisteria rounded-lg px-4 py-2 text-sm text-midnight placeholder:text-lilac focus:outline-none focus:border-violet sm:w-64"
                    />
                    <div className="grid grid-cols-3 gap-2 sm:flex">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`h-9 text-xs px-4 py-2 rounded-lg border transition-colors ${
                                    filter === f
                                        ? "bg-iris border-violet text-violet font-medium"
                                        : "bg-white border-wisteria text-heather hover:border-violet hover:text-violet"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 h-px bg-wisteria" />

                {/* Cards Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {filteredCards.map((card) => (
                        <SetCardItem
                            key={card.id}
                            card={card as TcgCardDetail}
                            setId={set.id}
                        />
                    ))}
                </div>

                {/* No cards found */}
                {filteredCards.length === 0 && (
                    <div className="text-center py-16 text-heather">
                        <p className="text-lg font-medium">No cards found</p>
                        <p className="text-sm mt-1">Try a different search term</p>
                    </div>
                )}
            </div>
        </CollectionProvider>
    );
}