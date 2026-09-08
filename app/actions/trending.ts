"use server";

import { prisma } from "@/lib/prisma";

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

type TrendingSnapshot = {
    cardId: string;
    current: number;
    previous: number;
    currency: string;
};

const TRENDING_CACHE_MS = 5 * 60 * 1000;
let trendingCache: { expiresAt: number; cards: TrendingCard[] } | undefined;
let trendingRequest: Promise<TrendingCard[]> | undefined;

export async function getTrendingCards(): Promise<TrendingCard[]> {
    if (trendingCache && trendingCache.expiresAt > Date.now()) {
        return trendingCache.cards;
    }

    if (trendingRequest) return trendingRequest;

    trendingRequest = getTrendingCardsUncached();
    try {
        const cards = await trendingRequest;
        trendingCache = { cards, expiresAt: Date.now() + TRENDING_CACHE_MS };
        return cards;
    } finally {
        trendingRequest = undefined;
    }
}

async function getTrendingCardsUncached(): Promise<TrendingCard[]> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const snapshots = await prisma.$queryRaw<TrendingSnapshot[]>`
        WITH ranked AS (
            SELECT
                "cardId",
                price,
                currency,
                ROW_NUMBER() OVER (
                    PARTITION BY "cardId" ORDER BY "recordedAt" ASC, id ASC
                ) AS earliest_rank,
                ROW_NUMBER() OVER (
                    PARTITION BY "cardId" ORDER BY "recordedAt" DESC, id DESC
                ) AS latest_rank,
                COUNT(*) OVER (PARTITION BY "cardId") AS snapshot_count
            FROM "PriceSnapshot"
            WHERE "recordedAt" >= ${weekAgo}
        )
        SELECT
            "cardId",
            MAX(price) FILTER (WHERE latest_rank = 1) AS current,
            MAX(price) FILTER (WHERE earliest_rank = 1) AS previous,
            MAX(currency) FILTER (WHERE latest_rank = 1) AS currency
        FROM ranked
        WHERE snapshot_count >= 2
        GROUP BY "cardId"
    `;

    const withChanges = snapshots
        .filter((snapshot) => snapshot.current !== snapshot.previous)
        .map((snapshot) => {
            const change = snapshot.current - snapshot.previous;
            return {
                ...snapshot,
                change,
                changePct: snapshot.previous === 0
                    ? 0
                    : (change / snapshot.previous) * 100,
            };
        })
        .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
        .slice(0, 5);

    if (withChanges.length === 0) return [];

    const cards = await prisma.tcgCard.findMany({
        where: { id: { in: withChanges.map((card) => card.cardId) } },
        select: {
            id: true,
            name: true,
            localId: true,
            image: true,
            set: { select: { name: true, cardCount: true } },
        },
    });
    const cardById = new Map(cards.map((card) => [card.id, card]));

    return withChanges.flatMap((change) => {
        const card = cardById.get(change.cardId);
        if (!card) return [];

        return [{
            cardId: change.cardId,
            cardName: card.name,
            setName: card.set.name,
            localId: card.localId,
            totalCards: card.set.cardCount,
            imageUrl: card.image ?? "",
            currentPrice: change.current,
            previousPrice: change.previous,
            change: change.change,
            changePct: change.changePct,
            currency: change.currency,
        }];
    });
}
