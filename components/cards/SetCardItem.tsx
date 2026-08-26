"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { TcgCardDetail, getBestPrice } from "@/lib/tcgdex";
import {
    addVariantToCollection,
    removeVariantFromCollection,
} from "@/app/actions/collection";
import { useCollection } from "@/context/CollectionContext";
import VariantIcon from "./VariantIcon";
import VariantDropdown from "./VariantDropdown";
import CardContextMenu from "./CardContextMenu";
import RarityIcon from "../icons/RarityIcon";

interface Props {
    card: TcgCardDetail;
    setId: string;
    standalone?: boolean;
    controlSize?: "sm" | "lg";
}

const VARIANT_KEYS = [
    "normal",
    "holo",
    "reverse",
    "firstEdition",
    "wPromo",
] as const;

export default function SetCardItem({
    card,
    setId,
    standalone = false,
    controlSize = "sm",
}: Props) {
    const { ownedVariantMap, addVariant, removeVariant } = useCollection();
    const ownedVariants = ownedVariantMap[card.id] ?? {};
    const [showDropdown, setShowDropdown] = useState(false);
    const [showContext, setShowContext] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { price, currency } = getBestPrice(card.pricing);
    const isLg = controlSize === "lg";
    const imageSize = isLg ? "high" : "low";

    const variants: string[] = card.variants
        ? VARIANT_KEYS.filter(
              (k) => card.variants?.[k as keyof typeof card.variants] === true,
          )
        : ["normal"];

    const defaultVariant = variants.includes("normal")
        ? "normal"
        : (variants[0] ?? "normal");

    const defaultOwned = ownedVariants[defaultVariant] ?? 0;
    const totalOwned = Object.values(ownedVariants).reduce((a, b) => a + b, 0);

    function handleQuickAdd() {
        addVariant(card.id, defaultVariant);
        startTransition(async () => {
            await addVariantToCollection({
                cardId: card.id,
                setId,
                cardName: card.name,
                setName: card.set.name,
                imageUrl: card.image ?? "",
                rarity: card.rarity,
                variant: defaultVariant,
                condition: "NEAR_MINT",
                quantity: 1,
            });
        });
    }

    function handleQuickRemove() {
        if (defaultOwned === 0) return;
        removeVariant(card.id, defaultVariant);
        startTransition(async () => {
            await removeVariantFromCollection({
                cardId: card.id,
                setId,
                variant: defaultVariant,
            });
        });
    }

    const cardVisual = (
        <div
            className={`bg-white border border-wisteria rounded-xl overflow-hidden transition-all ${isLg || totalOwned > 0 ? "opacity-100" : "opacity-50 hover:opacity-100"}`}
        >
            <div className="bg-lavender relative">
                {card.image ? (
                    <img
                        src={`${card.image}/${imageSize}.png`}
                        alt={card.name}
                        style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                        }}
                    />
                ) : (
                    <div className="w-full h-full min-h-70 flex items-center justify-center text-lilac text-xs">
                        No image
                    </div>
                )}
                {!standalone && (
                    <div className="flex flex-row gap-1 absolute bottom-0 px-2.5 py-1 bg-iris text-midnight rounded-tr-xl">
                        <p className="text-[12px]">
                            {card.localId}/{card.set.cardCount.official}
                        </p>
                        <RarityIcon
                            rarity={card.rarity ?? "Unknown"}
                            size={16}
                        />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div key={card.id} className="flex flex-col">
            <Link
                key={card.id}
                href={`/cards/${card.id}`}
                className="group no-underline"
            >
                {cardVisual}
            </Link>
            <div className="flex flex-col items-center justify-between mt-1 px-0.5 relative">
                {!standalone && (
                    <div className="p-2 space-y-0.5 flex flex-col">
                        <p className="text-[12px] font-bold text-violet text-center">
                            {price !== null
                                ? `${currency === "EUR" ? "€" : "$"}${price.toFixed(2)}`
                                : "-.--"}
                        </p>
                    </div>
                )}
                <div
                    className={`flex flex-row align-middle justify-between w-full px-5 ${isLg ? "mt-2" : "mt-0.5"}`}
                >
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowDropdown((v) => !v);
                                setShowContext(false);
                            }}
                            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                        >
                            <VariantIcon
                                variants={variants}
                                ownedVariants={ownedVariants}
                                size={20}
                            />
                        </button>
                        {showDropdown && (
                            <VariantDropdown
                                card={{
                                    id: card.id,
                                    setId,
                                    name: card.name,
                                    setName: card.set.name,
                                    imageUrl: card.image ?? "",
                                    rarity: card.rarity,
                                    variants,
                                }}
                                ownedVariants={ownedVariants}
                                onClose={() => setShowDropdown(false)}
                            />
                        )}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={handleQuickRemove}
                            disabled={isPending || defaultOwned === 0}
                            className={`text-heather hover:text-violet hover:cursor-pointer transition-colors ${isLg ? "text-xl w-8 h-8" : "text-sm w-5 h-5"} flex items-center justify-center`}
                        >
                            -
                        </button>
                        <span
                            className={`font-medium text-midnight ${isLg ? "text-xl w-8 h-8" : "text-sm w-5 h-5"} text-center`}
                        >
                            {defaultOwned}
                        </span>
                        <button
                            onClick={handleQuickAdd}
                            disabled={isPending}
                            className={`text-heather hover:text-violet hover:cursor-pointer transition-colors ${isLg ? "text-xl w-8 h-8" : "text-sm w-5 h-5"} flex items-center justify-center`}
                        >
                            +
                        </button>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowContext((v) => !v);
                                setShowDropdown(false);
                            }}
                            className={`text-heather hover:text-violet transition-colors text-base ${isLg ? "text-xl w-8 h-8" : "text-base w-5 h-5"} flex items-center justify-center`}
                        >
                            ⋮
                        </button>
                        {showContext && (
                            <CardContextMenu
                                card={{ id: card.id, setId, name: card.name }}
                                ownedVariants={ownedVariants}
                                onClose={() => setShowContext(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
