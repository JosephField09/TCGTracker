"use server";

import { prisma } from "@/lib/prisma";
import { getCard } from "@/lib/tcgdex";

export interface TrendingCard {
    cardId: string;
    cardName: string;
    setName: string;
    localId: string;
    totalCards: number;
    imageUrl: string;
    currentPrice: number;
    previousPrice: number;
    change: number;
    changePct: number;
    currency: string;
}

export async function getTrendingCards(): Promise<TrendingCard[]> {
    // Get all cards that have at least 2 snapshots
    const cardIds = await prisma.priceSnapshot.groupBy({
        by: ["cardId"],
        _count: { cardId: true },
        having: { cardId: { _count: { gte: 2 } } },
    });

    if (cardIds.length === 0) return [];

    const ids = cardIds.map((c) => c.cardId);

    // For each card get the most recent and oldest available snapshot
    const snapshots = await Promise.all(
        ids.map(async (cardId) => {
            const [latest, earliest] = await Promise.all([
                prisma.priceSnapshot.findFirst({
                    where: { cardId },
                    orderBy: { recordedAt: "desc" },
                }),
                prisma.priceSnapshot.findFirst({
                    where: { cardId },
                    orderBy: { recordedAt: "asc" },
                }),
            ]);
            return { cardId, latest, earliest };
        }),
    );

    // Calculate change for each card
    const withChanges = snapshots
        .filter((s) => s.latest && s.earliest && s.latest.id !== s.earliest.id)
        .map((s) => {
            const current = s.latest!.price;
            const previous = s.earliest!.price;
            const change = current - previous;
            const changePct = (change / previous) * 100;
            return {
                cardId: s.cardId,
                current,
                previous,
                change,
                changePct,
                currency: s.latest!.currency,
            };
        })
        .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
        .slice(0, 5);

    if (withChanges.length === 0) return [];

    // Fetch card details for display
    const results = await Promise.all(
        withChanges.map(async (c) => {
            try {
                const card = await getCard(c.cardId);
                return {
                    cardId: c.cardId,
                    cardName: card.name,
                    setName: card.set.name,
                    localId: card.localId,
                    totalCards: card.set.cardCount?.total ?? 0,
                    imageUrl: card.image ?? "",
                    currentPrice: c.current,
                    previousPrice: c.previous,
                    change: c.change,
                    changePct: c.changePct,
                    currency: c.currency,
                } as TrendingCard;
            } catch {
                return null;
            }
        }),
    );

    return results.filter(Boolean) as TrendingCard[];
}
