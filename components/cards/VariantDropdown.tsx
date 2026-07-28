"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { addVariantToCollection, removeVariantFromCollection } from "@/app/actions/collection";
import { useCollection } from "@/context/CollectionContext";
import VariantOptionsModal from "./VariantOptionsModal";

interface Props {
    card: {
        id: string;
        setId: string;
        name: string;
        setName: string;
        imageUrl: string;
        rarity?: string;
        variants: string[];
    };
    ownedVariants: Record<string, number>;
    onClose: () => void;
}

const VARIANT_LABELS: Record<string, string> = {
    normal: "Normal",
    holo: "Holo",
    reverse: "Reverse Holo",
    firstEdition: "First Edition",
    wPromo: "Winner Promo",
}

export default function VariantDropdown({ card, ownedVariants, onClose, }: Props) {
    const { addVariant, removeVariant } = useCollection();
    const [isPending, startTransition] = useTransition();
    const [modalVariant, setModalVariant] = useState<string | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [onClose]);

    function handleAdd(variant: string) {
        addVariant(card.id, variant);
        startTransition(async () => {
            await addVariantToCollection({
                cardId: card.id,
                setId: card.setId,
                cardName: card.name,
                setName: card.setName,
                imageUrl: card.imageUrl,
                rarity: card.rarity,
                variant,
                condition: "NEAR_MINT",
                quantity: 1,
            });
        });
    }

    function handleRemove(variant: string) {
        const count = ownedVariants[variant] ?? 0;
        if (count === 0) return;
        removeVariant(card.id, variant);
        startTransition(async () => {
            await removeVariantFromCollection({
                cardId: card.id,
                setId: card.setId,
                variant,
            });
        });
    }

    return (
        <>
            <div ref={ref} className="absolute bottom-full left-0 mb-1 w-56 bg-white border border-wisteria rounded-xl shadow-lg z-50 overflow-hidden">
                {card.variants.map((variant) => {
                    const count = ownedVariants[variant] ?? 0;
                    return (
                        <div key={variant} className="flex items-center gap-2 px-3 py-2.5 hover:bg-lavender transition-colors border-b border-wisteria last:border-0">
                            <button
                                onClick={() => handleAdd(variant)}
                                className="w-5 h-5 rounded border border-wisteria flex items-center justify-center text-violet hover:border-violet hover:bg-iris transition-colors text-xs font-medium shrink-0"
                            >+</button>
                            <span className="text-xs text-midnight flex-1 truncate">{VARIANT_LABELS[variant] ?? variant}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    onClick={() => handleRemove(variant)}
                                    disabled={count === 0}
                                    className="text-xs text-heather hover:text-violet disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >-</button>
                                <span className="text-xs font-medium text-midnight w-4 text-center">{count}</span>
                                <button
                                    onClick={() => handleAdd(variant)}
                                    className="text-xs text-heather hover:text-violet transition-colors"
                                >+</button>
                            </div>
                        </div>
                    );
                })}
                <div className="border-t border-wisteria"/>
                <button
                    onClick={() => setModalVariant("options")}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-lavender transition-colors text-left"
                ><span className="text-xs text-midnight">Add with more options</span></button>
                <button
                    onClick={() => setModalVariant("graded")}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-lavender transition-colors text-left border-t border-wisteria"
                ><span className="text-xs text-midnight">Add graded card</span></button>
                <div className="border-t border-wisteria">
                    <button className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-lavender transition-colors text-left">
                        <span className="text-xs text-heather">Card variant guide</span>
                    </button>
                </div>
            </div>
            {modalVariant && (
                <VariantOptionsModal
                    card={card}
                    initialVariant={modalVariant === "graded" ? "normal" : card.variants[0]}
                    isGraded={modalVariant === "graded"}
                    onClose={() => {
                        setModalVariant(null);
                        onClose();
                    }}
                />
            )}
        </>
    )
}