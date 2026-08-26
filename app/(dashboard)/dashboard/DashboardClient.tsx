"use client";

import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import type {
    DashboardStats,
    TopCard,
    SetProgress,
    RecentActivity,
} from "@/app/actions/dashboard";
import RarityBadge from "@/components/badges/RarityBadge";

interface Props {
    stats: DashboardStats;
    topCards: TopCard[];
    setProgress: SetProgress[];
    recentActivity: RecentActivity[];
}

export default function DashboardClient({
    stats,
    topCards,
    setProgress,
    recentActivity,
}: Props) {
    return (
        <div className="space-y-5 w-8/12 mx-auto">
            {/* Page title */}
            <h1 className="font-display text-3xl font-bold text-midnight">
                Dashboard
            </h1>

            {/* Stat row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-wisteria rounded-2xl p-5 flex flex-col justify-between">
                    <p className="text-base text-heather">Total cards</p>
                    <p className="text-4xl font-medium text-midnight mt-1">
                        {stats.totalCards.toLocaleString()}
                    </p>
                    <p className="text-base text-lilac mt-1.5">
                        Across {stats.totalSets} sets
                    </p>
                </div>

                <div className="bg-white border border-wisteria rounded-2xl p-5 flex flex-col justify-between">
                    <p className="text-base text-heather">Collection Value</p>
                    <p className="text-4xl font-medium text-midnight mt-1">
                        €{stats.collectionValue.toFixed(2)}
                    </p>
                    <p className="text-base text-price-up mt-1.5">
                        Market value
                    </p>
                </div>

                <div className="bg-white border border-wisteria rounded-2xl p-5 flex flex-col justify-between">
                    <p className="text-base text-heather">Most Expensive Card</p>
                    {stats.mostExpensiveCard ? (
                        <>
                            <Link
                                href={`/cards/${stats.mostExpensiveCard.cardId}`}
                                className="block text-xl font-medium text-midnight mt-1 hover:text-violet transition-colors no-underline truncate"
                            >
                                {stats.mostExpensiveCard.name}
                            </Link>
                            <p className="text-base text-gold mt-1.5">
                                €{stats.mostExpensiveCard.value.toFixed(2)}{" "}
                                market value
                            </p>
                        </>
                    ) : (
                        <p className="text-xl font-medium text-lilac mt-1">
                            No cards yet
                        </p>
                    )}
                </div>

                <div className="bg-white border border-wisteria rounded-2xl p-5 flex flex-col justify-between">
                    <p className="text-base text-heather">Sets Complete</p>
                    <p className="text-4xl font-medium text-midnight mt-1">
                        {stats.setsComplete}
                    </p>
                    <p className="text-base text-lilac mt-1.5">
                        {stats.setsInProgress} in progress
                    </p>
                </div>
            </div>

            {/* Chart + Top 5 */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
                {/* Portfolio value chart — placeholder */}
                <div className="bg-white border border-wisteria rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-2xl font-bold text-midnight">
                            Portfolio value
                        </h2>
                        <div className="flex gap-1">
                            {["30d", "90d", "1yr"].map((tab) => (
                                <button
                                    key={tab}
                                    className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                                        tab === "30d"
                                            ? "bg-iris text-violet font-medium"
                                            : "text-heather hover:text-violet"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-48 flex items-center justify-center text-lilac text-sm">
                        Price history coming soon
                    </div>
                </div>

                {/* Top 5 cards */}
                <div className="bg-white border border-wisteria rounded-2xl p-6">
                    <h2 className="font-display text-2xl font-bold text-midnight mb-4">
                        Top 5 cards
                    </h2>
                    {topCards.length === 0 ? (
                        <p className="text-sm text-lilac text-center py-8">
                            No cards in collection yet
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {topCards.map((card) => (
                                <Link
                                    key={card.cardId}
                                    href={`/cards/${card.cardId}`}
                                    className="flex items-center gap-3 no-underline group"
                                >
                                    <div className="w-9 h-12 bg-lavender rounded-sm overflow-hidden shrink-0">
                                        {card.imageUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={`${card.imageUrl}/low.png`}
                                                alt={card.cardName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-midnight truncate group-hover:text-violet transition-colors">
                                            {card.cardName}
                                        </p>
                                        <p className="text-[10px] text-lilac truncate">
                                            {card.setName}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs font-medium text-midnight">
                                            €{card.value.toFixed(2)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Set progress + Recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Set progress */}
                <div className="bg-white border border-wisteria rounded-2xl p-6">
                    <h2 className="font-display text-2xl font-bold text-midnight mb-4">
                        Set progress
                    </h2>
                    {setProgress.length === 0 ? (
                        <p className="text-sm text-lilac text-center py-8">
                            No sets in progress
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {setProgress.map((set) => (
                                <Link
                                    key={set.setId}
                                    href={`/sets/${set.setId}`}
                                    className="block no-underline group"
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <p className="text-sm font-medium text-midnight group-hover:text-violet transition-colors">
                                            {set.setName}
                                        </p>
                                        <p
                                            className={`text-xs font-medium ${
                                                set.isComplete
                                                    ? "text-price-up"
                                                    : "text-violet"
                                            }`}
                                        >
                                            {set.owned} / {set.total}
                                            {set.isComplete && " ✓"}
                                        </p>
                                    </div>
                                    <div className="h-2 bg-iris rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${
                                                set.isComplete
                                                    ? "bg-price-up"
                                                    : "bg-violet"
                                            }`}
                                            style={{
                                                width: `${
                                                    set.total > 0
                                                        ? Math.min(
                                                              100,
                                                              (set.owned /
                                                                  set.total) *
                                                                  100,
                                                          )
                                                        : 0
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent activity */}
                <div className="bg-white border border-wisteria rounded-2xl p-6">
                    <h2 className="font-display text-2xl font-bold text-midnight mb-4">
                        Recent Activity
                    </h2>
                    {recentActivity.length === 0 ? (
                        <p className="text-sm text-lilac text-center py-8">
                            No activity yet
                        </p>
                    ) : (
                        <div className="space-y-1">
                            {recentActivity.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/cards/${item.cardId}`}
                                    className="flex items-center gap-3 py-2.5 border-b border-lavender last:border-0 no-underline group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-iris flex items-center justify-center shrink-0">
                                        <span className="text-violet text-sm font-medium">
                                            +
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-midnight truncate group-hover:text-violet transition-colors">
                                            {item.cardName}
                                        </p>
                                        <p className="text-[10px] text-lilac mt-0.5">
                                            Added ·{" "}
                                            {formatDistanceToNowStrict(
                                                new Date(item.addedAt),
                                                {
                                                    addSuffix: true,
                                                },
                                            )}
                                        </p>
                                    </div>
                                    {item.rarity && (
                                        <RarityBadge
                                            rarity={item.rarity}
                                            showIcon={false}
                                            className="shrink-0"
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
