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
        <div className="space-y-5 w-8/12 mx-auto">
            {/* Breadcrumb */}
            <div className="flex gap-2 items-center text-sm">
                <Link
                    href="/sets"
                    className="text-lilac hover:text-violet transition-colors no-underline"
                >
                    Sets
                </Link>
                <span className="text-lilac">/</span>
                <Link
                    href={`/sets/${card.set.id}`}
                    className="text-lilac hover:text-violet transition-colors no-underline"
                >
                    {card.set.name}
                </Link>
                <span className="text-lilac">/</span>
                <span className="text-amethyst font-medium">
                    {card.name} - {card.localId}/{card.set.cardCount.official}
                </span>
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-[345px_1fr] gap-6">
                {/* Left Section */}
                <CollectionProvider initialMap={{ [card.id]: ownedVariants }}>
                    <div className="space-y-4">
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
                    <div className="bg-white border border-wisteria borer-2 rounded-2xl p-6">
                        <div>
                            <div className="flex flex-row justify-between">
                                <h1 className="font-display text-3xl font-bold text-dusk">
                                    {card.name}
                                </h1>
                                {card.illustrator && (
                                    <div className="text-sm text-right">
                                        <p className="text-lilac font-medium">
                                            Illustrator
                                        </p>
                                        <p className="text-dusk font-bold">
                                            {card.illustrator}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <p className="text-heather text-xl mt-2 flex-row flex gap-3">
                                {card.set.name} · {card.localId}/
                                {card.set.cardCount.official}
                                {card.rarity && (
                                    <RarityBadge rarity={card.rarity} />
                                )}
                                {card.types?.map((type) => (
                                    <TypeBadge key={type} type={type} />
                                ))}
                            </p>
                            {/* Price */}
                            <div className="flex flex-col items-baseline mt-4">
                                <p className="text-4xl font-medium text-dusk">
                                    {price !== null
                                        ? `${currency === "EUR" ? "€" : "$"}${price.toFixed(2)}`
                                        : "-.--"}
                                </p>
                                <div className="text-base flex flex-row items-center gap-2">
                                    {price !== null && updatedAt && (
                                        <p className="text-lilac">
                                            {source} market price · Updated{" "}
                                            {formatDistanceToNowStrict(
                                                new Date(updatedAt),
                                                {
                                                    addSuffix: true,
                                                },
                                            )} ·
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
                                <div className="grid grid-cols-3 gap-3.75 mt-4">
                                    {card.hp && (
                                        <div className="bg-iris rounded-lg p-3 pl-4">
                                            <p className="text-base text-lilac">
                                                HP
                                            </p>
                                            <p className="text-2xl font-medium text-dusk">
                                                {card.hp}
                                            </p>
                                        </div>
                                    )}
                                    {card.stage && (
                                        <div className="bg-iris rounded-lg p-3 pl-4">
                                            <p className="text-base text-lilac">
                                                Stage
                                            </p>
                                            <p className="text-2xl font-medium text-dusk">
                                                {card.stage}
                                            </p>
                                        </div>
                                    )}
                                    {card.dexId && (
                                        <div className="bg-iris rounded-lg p-3 pl-4">
                                            <p className="text-base text-lilac">
                                                Pokédex
                                            </p>
                                            <p className="text-2xl font-medium text-dusk">
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
