"use client";

import { useState, useTransition, useEffect } from "react";
import { createAlert } from "@/app/actions/alerts";
import { IoMdClose } from "react-icons/io";

interface Props {
    card: {
        id: string;
        name: string;
        setName: string;
        imageUrl: string;
    };
    currentPrice: number | null;
    currency: string;
    onClose: () => void;
}

export default function AlertModal({
    card,
    currentPrice,
    currency,
    onClose,
}: Props) {
    const [isPending, startTransition] = useTransition();
    const [direction, setDirection] = useState<"ABOVE" | "BELOW">("ABOVE");
    const [targetPrice, setTargetPrice] = useState(
        currentPrice ? (currentPrice * 1.1).toFixed(2) : "",
    );
    const [done, setDone] = useState(false);

    const symbol = currency === "EUR" ? "€" : "$";

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    function handleSubmit() {
        if (!targetPrice || isNaN(parseFloat(targetPrice))) return;
        startTransition(async () => {
            await createAlert({
                cardId: card.id,
                cardName: card.name,
                setName: card.setName,
                imageUrl: card.imageUrl,
                targetPrice: parseFloat(targetPrice),
                direction,
            });
            setDone(true);
            setTimeout(onClose, 1000);
        });
    }

    return (
        <div
            className="fixed inset-0 bg-midnight/40 backdrop-blur-sm z-100 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-wisteria">
                    <div>
                        <p className="text-sm font-medium text-midnight">
                            Set price alert
                        </p>
                        <p className="text-xs text-heather mt-0.5">
                            {card.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full hover:bg-lavender hover:cursor-pointer flex items-center justify-center text-heather hover:text-midnight transition-colors text-xl"
                    >
                        <IoMdClose />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-4">
                    {/* Current price reference */}
                    {currentPrice && (
                        <div className="bg-lavender rounded-xl px-4 py-3">
                            <p className="text-xs text-lilac">
                                Current market price
                            </p>
                            <p className="text-2xl font-medium text-midnight mt-0.5">
                                {symbol}
                                {currentPrice.toFixed(2)}
                            </p>
                        </div>
                    )}

                    {/* Direction */}
                    <div>
                        <p className="text-[10px] text-lilac font-medium uppercase tracking-wide mb-2">
                            Notify me when price goes
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {(["ABOVE", "BELOW"] as const).map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDirection(d)}
                                    className={`py-2 rounded-lg border text-sm font-medium transition-colors hover:cursor-pointer ${
                                        direction === d
                                            ? "bg-iris border-violet text-violet"
                                            : "bg-white border-wisteria text-heather hover:border-violet"
                                    }`}
                                >
                                    {d === "ABOVE" ? "↑ Above" : "↓ Below"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Target price */}
                    <div>
                        <p className="text-[10px] text-lilac font-medium uppercase tracking-wide mb-2">
                            Target price
                        </p>
                        <div className="flex items-center bg-lavender border border-wisteria rounded-lg px-3 py-2.5 gap-1.5 focus-within:border-violet transition-colors">
                            <span className="text-sm text-lilac">{symbol}</span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={targetPrice}
                                onChange={(e) => setTargetPrice(e.target.value)}
                                className="bg-transparent text-sm text-midnight placeholder:text-lilac outline-none w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-wisteria">
                    <button
                        onClick={handleSubmit}
                        disabled={isPending || done || !targetPrice}
                        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors hover:cursor-pointer ${
                            done
                                ? "bg-price-up-tint text-[#1A6B4A] border border-price-up"
                                : "bg-violet text-white hover:bg-amethyst disabled:opacity-50 disabled:cursor-not-allowed"
                        }`}
                    >
                        {isPending
                            ? "Setting alert..."
                            : done
                              ? "✓ Alert set"
                              : "Set alert"}
                    </button>
                </div>
            </div>
        </div>
    );
}
