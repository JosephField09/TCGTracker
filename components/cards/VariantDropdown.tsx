"use client";

import { useState, useTransition, useRef, useEffect, useLayoutEffect } from "react";
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
    const [mobilePosition, setMobilePosition] = useState<{ left: number; top: number } | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (modalVariant) return;

        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [modalVariant, onClose]);

    useLayoutEffect(() => {
        function positionMenu() {
            if (!ref.current) return;

            const anchor = ref.current.parentElement?.getBoundingClientRect();
            const menu = ref.current.getBoundingClientRect();
            if (!anchor) return;

            const margin = 8;
            const menuWidth = Math.min(224, window.innerWidth - margin * 2);
            const isMobile = window.innerWidth < 1024;
            const overflowsRight = anchor.left + menuWidth > window.innerWidth - margin;

            if (!isMobile && !overflowsRight) {
                setMobilePosition(null);
                return;
            }

            const left = Math.max(
                margin,
                Math.min(anchor.left, window.innerWidth - menuWidth - margin),
            );
            const aboveTop = anchor.top - menu.height - 4;
            const top = aboveTop >= margin
                ? aboveTop
                : Math.min(anchor.bottom + 4, window.innerHeight - menu.height - margin);

            setMobilePosition({ left, top: Math.max(margin, top) });
        }

        positionMenu();
        const firstFrame = requestAnimationFrame(() => {
            positionMenu();
            requestAnimationFrame(positionMenu);
        });
        window.addEventListener("resize", positionMenu);
        window.addEventListener("scroll", positionMenu, true);
        return () => {
            cancelAnimationFrame(firstFrame);
            window.removeEventListener("resize", positionMenu);
            window.removeEventListener("scroll", positionMenu, true);
        };
    }, [card.variants.length]);

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
            <div
                ref={ref}
                style={mobilePosition ? {
                    bottom: "auto",
                    right: "auto",
                    left: mobilePosition.left,
                    top: mobilePosition.top,
                    width: `min(14rem, calc(100vw - 1rem))`,
                } : undefined}
                className={`${mobilePosition
                    ? "fixed"
                    : "absolute bottom-full left-0"
                } z-50 max-h-[70vh] w-56 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-wisteria bg-white shadow-lg`}
            >
                {card.variants.map((variant) => {
                    const count = ownedVariants[variant] ?? 0;
                    return (
                        <div key={variant} className="flex min-h-11 items-center gap-2 border-b border-wisteria px-3 py-2.5 transition-colors hover:bg-lavender last:border-0">
                            <button
                                onClick={() => handleAdd(variant)}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-wisteria text-xs font-medium text-violet transition-colors hover:cursor-pointer hover:border-violet hover:bg-iris"
                            >+</button>
                            <span className="text-xs text-midnight flex-1 truncate">{VARIANT_LABELS[variant] ?? variant}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    onClick={() => handleRemove(variant)}
                                    disabled={count === 0}
                                    className="flex h-8 w-8 items-center justify-center text-sm text-heather transition-colors hover:cursor-pointer hover:text-violet disabled:cursor-not-allowed disabled:opacity-30"
                                >-</button>
                                <span className="text-xs font-medium text-midnight w-4 text-center">{count}</span>
                                <button
                                    onClick={() => handleAdd(variant)}
                                    className="flex h-8 w-8 items-center justify-center text-sm text-heather transition-colors hover:cursor-pointer hover:text-violet"
                                >+</button>
                            </div>
                        </div>
                    );
                })}
                <div className="border-t border-wisteria"/>
                <button
                    onClick={() => setModalVariant("options")}
                    className="flex min-h-11 w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:cursor-pointer hover:bg-lavender"
                ><span className="text-xs text-midnight">Add with more options</span></button>
                <button
                    onClick={() => setModalVariant("graded")}
                    className="flex min-h-11 w-full items-center gap-2.5 border-t border-wisteria px-3 py-2.5 text-left transition-colors hover:cursor-pointer hover:bg-lavender"
                ><span className="text-xs text-midnight">Add graded card</span></button>
                <div className="border-t border-wisteria">
                    <button className="flex min-h-11 w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:cursor-pointer hover:bg-lavender">
                        <span className="text-xs text-heather">Card variant guide</span>
                    </button>
                </div>
            </div>
            {modalVariant && (
                <VariantOptionsModal
                    card={card}
                    initialVariant={modalVariant === "graded" ? "normal" : card.variants[0]}
                    isGraded={modalVariant === "graded"}
                    onAdded={(variant, quantity) =>
                        addVariant(card.id, variant, quantity)
                    }
                    onClose={() => {
                        setModalVariant(null);
                        onClose();
                    }}
                />
            )}
        </>
    )
}