"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import CardStack from "./CardStack";
import type { TrendingCard } from "@/app/actions/trending";

interface Props {
    trendingCards: TrendingCard[];
}

export default function LandingPage({ trendingCards }: Props) {
    return (
        <div className="flex-1 space-y-5 w-8/12 mx-auto">
            {/* Hero */}
            <section className="flex-1 px-6 py-20 flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                    {/* Left — copy */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="font-display text-[57px] font-bold text-dusk leading-tight">
                            Catch Every Card
                            <br />
                            Track Every Value
                        </h1>
                        <p className="text-heather text-2xl font-medium t-4 leading-relaxed max-w-md">
                            Track your Pokémon card collection, monitor live
                            values, and discover what your cards are worth.
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                            <Link
                                href="/sign-up"
                                className="box-border border-4 border-transparent uppercase bg-violet text-lavender px-6 py-3 rounded-full text-2xl font-bold hover:bg-amethyst transition-colors no-underline"
                            >
                                Start tracking
                            </Link>
                            <Link
                                href="/sets"
                                className="box-border border-4 border-violet bg-none uppercase text-midnight px-6 py-3 rounded-full text-2xl font-bold hover:border-violet hover:text-violet transition-colors no-underline"
                            >
                                Browse sets
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right — card stack */}
                    <motion.div
                        className="flex justify-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <CardStack />
                    </motion.div>
                </div>
            </section>

            {/* Trending this week */}
            <section className="mx-auto px-6 pb-20 w-full">
                <h2 className="font-display text-3xl font-bold text-dusk mb-6">
                    Trending this week
                </h2>

                {trendingCards.length === 0 ? (
                    <div className="bg-white border border-wisteria rounded-2xl p-12 text-center">
                        <p className="text-sm text-heather">
                            Price trend data is building up - check back soon
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {trendingCards.map((card) => {
                            const symbol = card.currency === "EUR" ? "€" : "$";
                            const isPositive = card.change >= 0;

                            return (
                                <Link
                                    key={card.cardId}
                                    href={`/cards/${card.cardId}`}
                                    className="bg-white border border-wisteria rounded-xl p-3 overflow-hidden hover:border-violet shadow-md transition-all no-underline group"
                                >
                                    {/* Card image */}
                                    <div>
                                        {card.imageUrl && (
                                            <img
                                                src={`${card.imageUrl}/low.png`}
                                                alt={card.cardName}
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-3 space-y-0.5 text-center">
                                        <p className="text-sm font-bold text-midnight truncate group-hover:text-violet transition-colors">
                                            {card.cardName} - {card.localId} / {card.totalCards}
                                        </p>
                                        <p className="text-xs text-heather truncate">
                                            Set: {card.setName}
                                        </p>
                                        <p className="text-xl font-bold text-midnight">
                                            {symbol}
                                            {card.currentPrice.toFixed(2)}
                                        </p>

                                        {/* Change badge */}
                                        <div
                                            className={`inline-flex items-center gap-1 text-base font-medium mt-1 px-2 py-0.5 rounded-full ${
                                                isPositive
                                                    ? "bg-price-up text-price-up-tint"
                                                    : "bg-price-down text-price-down-tint"
                                            }`}
                                        >
                                            <span>
                                                {isPositive ? "↑" : "↓"}
                                            </span>
                                            {symbol}
                                            {Math.abs(card.change).toFixed(2)} (
                                            {Math.abs(card.changePct).toFixed(
                                                1,
                                            )}
                                            %)
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
