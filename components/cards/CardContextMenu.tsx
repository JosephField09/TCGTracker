"use client";

import { useRef, useEffect, useTransition } from "react";
import { removeVariantFromCollection } from "@/app/actions/collection";

interface Props {
    card: {
        id: string
        setId: string;
        name: string;
    };
    ownedVariants: Record<string, number>;
    onClose: () => void;
}

export default function CardContextMenu({ card, ownedVariants, onClose }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [isPending, startTransition] = useTransition();
    const isOwned = Object.values(ownedVariants).some((q) => q > 0);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [onClose]);

    function copyLink() {
        navigator.clipboard.writeText(
            `${window.location.origin}/cards/${card.id}`
        );
        onClose();
    }

    function removeAll() {
        if (!confirm(`Remove all copies of ${card.name} from your collection?`)) return;
        startTransition(async () => {
            const variants = Object.keys(ownedVariants);
            for (const variant of variants) {
                for (let i = 0; i < ownedVariants[variant]; i++) {
                    await removeVariantFromCollection({
                        cardId: card.id,
                        setId: card.setId,
                        variant,
                    });
                }
            }
            onClose();
        });
    }

    return (
        <div
            ref={ref}
            className="absolute bottom-full right-0 mb-1 w-44 bg-white border border-wisteria rounded-xl shadow-lg z-50 overflow-hidden"
        >
            <a
                href={`/cards/${card.id}`}
                className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-lavender transition-colors no-underline border-b border-wisteria"
            ><span className="text-xs text-midnight">View card</span></a>
            <button
                onClick={copyLink}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-lavender transition-colors text-left border-b border-wisteria"
            ><span className="text-xs text-midnight">Copy card link</span></button>
            <a
                href={`/cards/${card.id}#price-history`}
                className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-lavender transition-colors no-underline border-b border-wisteria"
            >
                <span className="text-xs text-midnight">View price history</span>
            </a>
            {isOwned && (
                <button
                    onClick={removeAll}
                    disabled={isPending}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-price-down-tint transition-colors text-left"
                ><span className="text-xs text-price-down">Remove all</span></button>
            )}
        </div>
    );
}