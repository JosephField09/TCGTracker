"use client";

import { useState, useTransition, useEffect } from "react";
import { addVariantToCollection } from "@/app/actions/collection";
import { IoMdClose } from "react-icons/io";

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
    initialVariant: string;
    isGraded?: boolean;
    onClose: () => void;
    onAdded: (variant: string, quantity: number) => void;
}

const CONDITIONS = [
    { value: "MINT", label: "Mint" },
    { value: "NEAR_MINT", label: "Near Mint" },
    { value: "LIGHTLY_PLAYED", label: "Lightly Played" },
    { value: "MODERATELY_PLAYED", label: "Mod. Played" },
    { value: "HEAVILY_PLAYED", label: "Heavily Played" },
    { value: "DAMAGED", label: "Damaged" },
] as const;

const GRADE_COMPANIES = ["PSA", "BGS", "CGC"] as const;

const VARIANT_LABELS: Record<string, string> = {
    normal: "Normal",
    holo: "Holo",
    reverse: "Reverse Holo",
    firstEdition: "First Edition",
    wPromo: "Winner Promo",
}

export default function VariantOptionsModal({
    card,
    initialVariant,
    isGraded = false,
    onClose,
    onAdded,
}: Props) {
    const [isPending, startTransition] = useTransition();
    const [variant, setVariant] = useState(initialVariant);
    const [condition, setCondition] = useState("NEAR_MINT");
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState("");
    const [gradeCompany, setGradeCompany] = useState<string>("PSA");
    const [gradeValue, setGradeValue] = useState("");
    const [done, setDone] = useState(false);

    // Locking body scrolling while modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    function handleSubmit() {
        onAdded(variant, quantity);
        startTransition(async () => {
            await addVariantToCollection({
                cardId: card.id,
                setId: card.setId,
                cardName: card.name,
                setName: card.setName,
                imageUrl: card.imageUrl,
                rarity: card.rarity,
                variant,
                condition,
                quantity,
                notes: isGraded
                    ? `${gradeCompany} ${gradeValue} | ${notes}`
                    : notes || undefined,
            });
            setDone(true);
            setTimeout(onClose, 800)
        });
    }

    return (
        <div
            className="fixed inset-0 bg-midnight/40 backdrop-blur-sm z-100 flex items-center justify-center p-4"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-wisteria">
                    <div>
                        <p className="text-sm font-medium text-midnight">{card.name}</p>
                        <p className="text-xs text-heather mt-0.5">
                            {isGraded ? "Add graded card" : "Add with more options"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full hover:bg-lavender hover:cursor-pointer flex items-center justify-center text-heather hover:text-midnight transition-colors text-lg"
                    >
                        <IoMdClose />
                    </button>
                </div>
                <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Variant selector */}
                    <div>
                        <p className="text-[10px] text-lilac font-medium uppercase tracking-wide mb-2">Variant</p>
                        <div className="flex flex-wrap gap-1.5">
                            {card.variants.map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setVariant(v)}
                                    className={`text-xs px-3 py-1.5 hover:cursor-pointer rounded-full border transition-colors ${
                                        variant === v
                                        ? "bg-iris border-violet text-violet font-medium"
                                        : "bg-white border-wisteria text-heather hover:border-violet"
                                    }`}
                                >{VARIANT_LABELS[v] ?? v}</button>
                            ))}
                        </div>
                    </div>

                    {/* Graded fields */}
                    {isGraded && (
                        <div>
                            <p className="text-[10px] text-lilac font-medium uppercase tracking-wide mb-2">
                                Grading company
                            </p>
                            <div className="flex gap-1.5 mb-3">
                                {GRADE_COMPANIES.map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setGradeCompany(g)}
                                        className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors hover:cursor-pointer ${
                                            gradeCompany === g
                                            ? "bg-iris border-violet text-violet font-medium"
                                            : "bg-white border-wisteria text-heather hover:border-violet"
                                        }`}
                                    >{g}</button>
                                ))}
                            </div>
                            <p className="text-[10px] text-lilac font-medium uppercase tracking-wide mb-2">
                                Grade
                            </p>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                step="0.5"
                                placeholder="e.g. 9.5"
                                value={gradeValue}
                                onChange={(e) => setGradeValue(e.target.value)}
                                className="w-full bg-lavender border border-wisteria rounded-lg px-3 py-2 text-sm text-midnight placeholder:text-lilac outline-none focus:border-violet transition-colors"
                            />
                        </div>
                    )}

                    {/* Condition - hidden for graded */}
                    {!isGraded && (
                        <div>
                            <p className="text-[10px] text-lilac font-medium uppercase tracking-wide mb-2">Condition</p>
                            <div className="grid grid-cols-2 gap-1.5">
                                {CONDITIONS.map((c) => (
                                    <button
                                        key={c.value}
                                        onClick={() => setCondition(c.value)}
                                        className={`text-xs py-1.5 rounded-lg border transition-colors hover:cursor-pointer ${
                                            condition === c.value
                                            ? "bg-iris border-violet text-violet font-medium"
                                            : "bg-white border-wisteria text-heather hover:border-violet"
                                        }`}
                                    >{c.label}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div>
                        <p className="text-[10px] text-lilac font-medium uppercase tracking-wide mb-2">
                            Quantity
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-8 h-8 rounded-full border border-wisteria text-heather hover:border-violet hover:text-violet hover:cursor-pointer transition-colors"
                            >-</button>
                            <span className="text-sm font-medium text-midnight w-6 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-8 h-8 rounded-full border border-wisteria text-heather hover:border-violet hover:text-violet hover:cursor-pointer transition-colors"
                            >+</button>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <p className="text-[10px] text-lilac font-medium uppercase tracking-wide mb-2">
                            Notes (optional)
                        </p>
                        <textarea
                            placeholder="Any notes about this card..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            className="w-full bg-lavender border border-wisteria rounded-lg px-3 py-2 text-sm text-midnight placeholder:text-lilac outline-none focus:border-violet transition-colors resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-wisteria">
                    <button
                        onClick={handleSubmit}
                        disabled={isPending || done}
                        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors hover:cursor-pointer ${
                            done
                            ? "bg-price-up-tint text-[#1A6B4A] border border-price-up"
                            : "bg-violet text-white hover:bg-amethyst disabled:opacity-50 disabled:cursor-not-allowed"
                        }`}
                        >
                        {isPending ? "Adding..." : done ? "✓ Added to collection" : "Add to collection"}
                    </button>
                </div>
            </div>
        </div>
    );
}
