"use client";

import { TcgCardDetail, getBestPrice } from "@/lib/tcgdex";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import RarityBadge from "@/components/badges/RarityBadge";
import TypeBadge from "@/components/badges/TypeBadge";
import SetCardItem from "@/components/cards/SetCardItem";
import { CollectionProvider } from "@/context/CollectionContext";
import { PriceHistoryPoint } from "@/app/actions/prices";
import PriceHistoryChart from "@/components/cards/PriceHistoryChart";
import AlertModal from "@/components/cards/AlertModal";
import { useState } from "react";
import { FaBell } from "react-icons/fa6";

interface Props {
    card: TcgCardDetail;
    ownedVariants: Record<string, number>;
    initialPriceHistory: PriceHistoryPoint[];
    snapshotCount: number;
}

export default function CardClient({
    card,
    ownedVariants,
    initialPriceHistory,
    snapshotCount,
}: Props) {
    const { price, currency, source } = getBestPrice(card.pricing);
    const [showAlertModal, setShowAlertModal] = useState(false);

    const updatedAt =
        card.pricing?.cardmarket?.updated ??
        card.pricing?.tcgplayer?.updated ??
        null;

    return (
        <div className="mx-auto w-11/12 min-w-0 space-y-5 md:w-10/12 lg:w-8/12">
            {/* Breadcrumb */}
            <div className="flex min-w-0 gap-2 items-center text-sm">
                <Link
                    href="/sets"
                    className="text-lilac text-xs sm:text-sm hover:text-violet transition-colors no-underline"
                >
                    Sets
                </Link>
                <span className="text-lilac text-xs sm:text-sm">/</span>
                <Link
                    href={`/sets/${card.set.id}`}
                    className="text-lilac text-xs sm:text-sm truncate hover:text-violet transition-colors no-underline"
                >
                    {card.set.name}
                </Link>
                <span className="text-lilac text-xs sm:text-sm">/</span>
                <span className="min-w-0 text-xs sm:text-sm truncate text-amethyst font-medium">
                    {card.name} - {card.localId}/{card.set.cardCount.official}
                </span>
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 sm:grid-cols-[345px_1fr] md:grid-cols-1 lg:grid-cols-[345px_1fr] gap-6">
                {/* Left Section */}
                <CollectionProvider initialMap={{ [card.id]: ownedVariants }}>
                    <div className="space-y-4 md:flex md:w-86.25 md:justify-self-center lg:block lg:w-auto">
                        <SetCardItem
                            card={card}
                            setId={card.set.id}
                            standalone
                            controlSize="lg"
                        />
                    </div>
                </CollectionProvider>
                {/* Right Section */}
                <div className="space-y-4">
                    <div className="min-w-0 bg-white border border-wisteria borer-2 rounded-2xl p-4 md:p-6">
                        <div>
                            <div className="flex gap-3 flex-row justify-between align-center items-center">
                                <h1 className="min-w-0 font-display text-lg font-bold text-dusk lg:text-3xl">
                                    {card.name}
                                </h1>
                                {card.illustrator && (
                                    <div className="text-right text-xs lg:text-sm lg:text-right">
                                        <p className="text-lilac font-medium">
                                            Illustrator
                                        </p>
                                        <p className="text-dusk font-bold">
                                            {card.illustrator}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-2 flex flex-col md:flex-row md:flex-wrap items-center gap-2 text-sm text-heather lg:text-xl">
                                {card.set.name} · {card.localId}/
                                {card.set.cardCount.official}
                                <div className="flex flex-wrap gap-2">
                                    {card.rarity && (
                                        <RarityBadge rarity={card.rarity} />
                                    )}
                                    {card.types?.map((type) => (
                                        <TypeBadge key={type} type={type} />
                                    ))}
                                </div>
                            </div>
                            {/* Price */}
                            <div className="mt-4 flex w-full flex-col items-center text-center lg:items-baseline lg:text-left">
                                <p className="text-3xl font-medium text-center text-dusk lg:text-4xl">
                                    {price !== null
                                        ? `${currency === "EUR" ? "€" : "$"}${price.toFixed(2)}`
                                        : "-.--"}
                                </p>
                                <div className="flex flex-col md:flex-row items-center gap-2 text-sm lg:text-base">
                                    {price !== null && updatedAt && (
                                        <p className="text-lilac">
                                            {source} market price · Updated{" "}
                                            {formatDistanceToNowStrict(
                                                new Date(updatedAt),
                                                {
                                                    addSuffix: true,
                                                },
                                            )}
                                            <span className="hidden sm:inline sm:ml-1">
                                                ·
                                            </span>
                                        </p>
                                    )}
                                    <button
                                        onClick={() => setShowAlertModal(true)}
                                        className="flex items-center gap-2 text-base text-violet hover:text-amethyst transition-colors font-medium"
                                    >
                                        <FaBell />Set price alert
                                    </button>
                                    {showAlertModal && (
                                        <AlertModal
                                            card={{
                                                id: card.id,
                                                name: card.name,
                                                setName: card.set.name,
                                                imageUrl: card.image ?? "",
                                            }}
                                            currentPrice={price}
                                            currency={currency}
                                            onClose={() =>
                                                setShowAlertModal(false)
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                            {(card.hp || card.stage || card.dexId) && (
                                <div className="mt-4 grid grid-cols-3 text-center lg:text-left gap-2.5 lg:gap-3.75">
                                    {card.hp && (
                                        <div className="min-w-0 bg-iris rounded-lg p-2 lg:p-3 lg:pl-4">
                                            <p className="text-xs text-lilac lg:text-base">
                                                HP
                                            </p>
                                            <p className="truncate text-xl font-medium text-dusk lg:text-2xl">
                                                {card.hp}
                                            </p>
                                        </div>
                                    )}
                                    {card.stage && (
                                        <div className="min-w-0 bg-iris rounded-lg p-2 lg:p-3 lg:pl-4">
                                            <p className="text-xs text-lilac lg:text-base">
                                                Stage
                                            </p>
                                            <p className="truncate text-xl font-medium text-dusk lg:text-2xl">
                                                {card.stage}
                                            </p>
                                        </div>
                                    )}
                                    {card.dexId && (
                                        <div className="min-w-0 bg-iris rounded-lg p-2 lg:p-3 lg:pl-4">
                                            <p className="text-xs text-lilac lg:text-base">
                                                Pokédex
                                            </p>
                                            <p className="truncate text-xl font-medium text-dusk lg:text-2xl">
                                                {card.dexId
                                                    .map(
                                                        (id) =>
                                                            `#${String(id).padStart(4, "0")}`,
                                                    )
                                                    .join(", ")}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <PriceHistoryChart
                        cardId={card.id}
                        initialData={initialPriceHistory}
                        snapshotCount={snapshotCount}
                    />
                </div>
            </div>
        </div>
    );
}
