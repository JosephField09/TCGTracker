"use client";

import { useState, useMemo } from "react";
import { TcgCardDetail, TcgSetDetail, getBestPrice } from "@/lib/tcgdex";
import Link from "next/link";

interface Props{
    set: TcgSetDetail & { cards: TcgCardDetail[] };
}

const FILTERS = ["All", "Owned", "Missing"] as const;
type Filter = typeof FILTERS[number];

export default function SetClient({ set }: Props) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<Filter>("All");

    const rarityCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        set.cards.forEach((card) => {
            const r = card.rarity ?? "Unknown";
            counts[r] = (counts[r] ?? 0) + 1;
        });
        return counts;
    }, [set.cards]);

    const filteredCards = useMemo(() => {
        return set.cards
    }, [set.cards, search]);

    const owned = 0;
    const total = set.cardCount.official;
    const percentage = total > 0 ? ((owned / total) * 100).toFixed(1) : "0.0";

    return (
        <div className="space-y-5 w-8/12 mx-auto">
            {/* Breadcrumb */}
            <div className="flex gap-2 items-center text-sm">
                <Link href="/sets" className="text-lilac hover:text-violet transition-colors no-underline">
                    Sets
                </Link>
                <span className="text-lilac">/</span>
                <span className="text-amethyst font-medium">{set.name}</span>
            </div>

            {/* Set Header */}
            <div className="bg-white border border-wisteria rounded-2xl p-6 pl-10 pr-10 flex items-center gap-6">
                <div className="h-24 w-32 flex items-center justify-center shrink-0">
                    {set.logo ? (
                        <img src={`${set.logo}.png`} alt={set.name} className="max-h-16 max-w-full object-contain"/>
                    ) : ( 
                        <div className="h-16 w-32 bg-lavender rounded-xl flex items-center justify-center text-lilac text-xs">
                            No Logo
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="font-display text-2xl text-midnight font-bold">{set.name}</h1>
                    <p className="text-heather text-sm mt-1 font-medium">
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
                <div className="flex gap-8 shrink-0">
                    <div className="text-center">
                        <p className="text-2xl font-medium text-midnight">{set.cardCount.official}</p>
                        <p className="text-xs text-lilac mt-0.5">Total cards</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-medium text-violet">{owned}</p>
                        <p className="text-xs text-lilac mt-0.5">Owned cards</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-medium text-price-down">{total - owned}</p>
                    <p className="text-xs text-lilac mt-0.5">Missing</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-medium text-gold">£-.--</p>
                        <p className="text-xs text-lilac mt-0.5">Estimated Value</p>
                    </div>
                </div>
            </div>

            {/* Set Progress */}
            <div className="bg-white border border-wisteria rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                    <div>
                        <p className="text-3xl font-medium text-violet">{percentage}%</p>
                        <p className="text-sm text-heather mt-0.5">Set complete</p>
                    </div>
                    <div className="flex-1 h-3 bg-iris rounded-full overflow-hidden">
                        <div
                            className="h-full bg-violet rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(rarityCounts).map(([rarity, count]) => (
                        <span
                            key={rarity}
                            className="text-xs px-3 py-1 rounded-full border border-wisteria bg-lavender text-heather font-medium"
                        >
                            {rarity} {count}
                        </span>
                    ))}
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-wrap items-center gap-3">
                <input
                    type="text"
                    placeholder="Search in this set..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white border border-wisteria rounded-lg px-4 py-2 text-sm text-midnight placeholder:text-lilac focus:outline-none focus:border-violet w-64"
                />
                <div className="flex gap-2">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`text-xs px-4 py-2 rounded-lg border transition-colors ${
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
            <div className="grid grid-cols-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {filteredCards.map((card) => {
                    const { price, currency } = getBestPrice(card.pricing);
                    return (
                        <div key={card.id} className="flex flex-col">
                            <Link key={card.id} href={`/cards/${card.id}`} className="group no-underline">
                                <div className="bg-white border border-wisteria rounded-xl overflow-hidden hover:border-violet hover:border-2 hover:shadow-sm transition-all">
                                    <div className="bg-lavender relative">
                                        {card.image ? (
                                            <img
                                                src={`${card.image}/low.png`}
                                                alt={card.name}
                                                className="w-full h-full object-cover overflow-hidden"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-lilac text-xs">
                                                No image
                                            </div>
                                        )}
                                        <p className="absolute bottom-0 text-[12px] px-2.5 py-1 bg-iris text-midnight rounded-tr-xl">{card.localId}/{set.cardCount.official}</p>
                                    </div>
                                </div>
                            </Link>
                            <div className="p-2 space-y-0.5 flex flex-col">
                                <p className="text-[12px] font-bold text-violet text-center">
                                    {price !== null
                                        ? `${currency === "EUR" ? "€" : "$"}${price.toFixed(2)}`
                                        : "-.--"}
                                    </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* No cards found */}
            {filteredCards.length === 0 && (
                <div className="text-center py-16 text-heather">
                    <p className="text-lg font-medium">No cards found</p>
                    <p className="text-sm mt-1">Try a different search term</p>
                </div>
            )}
        </div>
    );
}