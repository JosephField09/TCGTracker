"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface CollectionContextType {
    ownedVariantMap: Record<string, Record<string, number>>;
    addVariant: (cardId: string, variant: string, quantity?: number) => void;
    removeVariant: (cardId: string, variant: string) => void;
}

const CollectionContext = createContext<CollectionContextType | null>(null);

export function CollectionProvider({
    children,
    initialMap,
}: {
    children: React.ReactNode;
    initialMap: Record<string, Record<string, number>>;
}) {
    const [ownedVariantMap, setOwnedVariantMap] = useState(initialMap);

    const addVariant = useCallback(
        (cardId: string, variant: string, quantity = 1) => {
            setOwnedVariantMap((prev) => ({
                ...prev,
                [cardId]: {
                    ...prev[cardId],
                    [variant]: (prev[cardId]?.[variant] ?? 0) + quantity,
                },
            }));
        },
        []
    );

    const removeVariant = useCallback((cardId: string, variant: string) => {
        setOwnedVariantMap((prev) => {
            const current = prev[cardId]?.[variant] ?? 0;
            if (current <= 1) {
                const updated = { ...prev[cardId] };
                delete updated[variant];
                return { ...prev, [cardId]: updated };
            }
            return {
                ...prev,
                [cardId]: {
                    ...prev[cardId],
                    [variant]: current - 1,
                },
            };
        });
    }, []);

    return (
        <CollectionContext.Provider
            value={{ ownedVariantMap, addVariant, removeVariant }}
        >
            {children}
        </CollectionContext.Provider>
    );
}

export function useCollection() {
    const ctx = useContext(CollectionContext);
    if (!ctx) throw new Error("useCollection must be used within CollectionProvider");
    return ctx;
}