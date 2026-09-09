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
        <div className="flex-1 space-y-5 w-full lg:w-8/12 mx-auto">
            {/* Hero */}
            <section className="flex-1 px-6 py-10 lg:py-20 flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-center lg:text-left w-full">
                    {/* Left — copy */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="font-display text-4xl lg:text-[57px] font-bold text-dusk leading-tight">
                            Catch Every Card
                            <br />
                            Track Every Value
                        </h1>
                        <div className="flex h-75 items-center justify-center pb-10 lg:hidden">
                            <CardStack className="scale-75" />
                        </div>
                        <p className="text-heather text-lg lg:text-2xl lg:text-left align-center text-center font-medium t-4 leading-relaxed max-w-md">
                            Track your Pokémon card collection, monitor live
                            values, and discover what your cards are worth.
                        </p>
                        <div className="flex content-center justify-center lg:justify-normal gap-4 mt-4">
                            <Link
                                href="/sign-up"
                                className="box-border w-1/2 lg:w-fit border-4 border-transparent uppercase bg-violet text-lavender text-center px-4 lg:px-6 py-2 lg:py-3 rounded-full text-sm lg:text-2xl font-bold hover:bg-amethyst transition-colors no-underline"
                            >
                                Start tracking
                            </Link>
                            <Link
                                href="/sets"
                                className="box-border w-1/2 lg:w-fit border-4 border-violet bg-none uppercase text-midnight text-center justify-center px-4 lg:px-6 py-2 lg:py-3 rounded-full text-sm lg:text-2xl font-bold hover:border-violet hover:text-violet transition-colors no-underline"
                            >
                                Browse sets
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right — card stack */}
                    <motion.div
                        className="hidden justify-center lg:flex"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <CardStack />
                    </motion.div>
                </div>
            </section>

            {/* Trending this week */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                >
                <section className="mx-auto px-6 pb-10 lg:pb-20 w-full">
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
                        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
                            {trendingCards.map((card) => {
                                const symbol = card.currency === "EUR" ? "€" : "$";
                                const isPositive = card.change >= 0;

                                return (
                                    <Link
                                        key={card.cardId}
                                        href={`/cards/${card.cardId}`}
                                        className="min-w-[60%] snap-start bg-white border border-wisteria rounded-xl p-3 overflow-hidden hover:border-violet shadow-md transition-all no-underline group sm:min-w-[50%] lg:min-w-0"
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
                                                className={`inline-flex items-center gap-1 text-sm lg:text-base font-medium mt-1 px-2 py-0.5 rounded-full ${
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
            </motion.div>
        </div>
    );
}
