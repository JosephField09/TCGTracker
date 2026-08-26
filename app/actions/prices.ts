"use server";

import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";

export interface PriceHistoryPoint {
    date: string;
    price: number;
    currency: string;
}

export async function getPriceHistory(
    cardId: string,
    days: 30 | 90 | 365,
): Promise<PriceHistoryPoint[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    const snapshots = await prisma.priceSnapshot.findMany({
        where: {
            cardId,
            recordedAt: { gte: since },
        },
        orderBy: { recordedAt: "asc" },
        select: {
            price: true,
            currency: true,
            recordedAt: true,
        },
    });

    return snapshots.map((s) => ({
        date: s.recordedAt.toISOString().split("T")[0],
        price: s.price,
        currency: s.currency,
    }));
}

export async function getSnapshotCount(cardId: string): Promise<number> {
    return prisma.priceSnapshot.count({ where: { cardId } });
}

export async function getPortfolioHistory(
    days: 30 | 90 | 365,
): Promise<PriceHistoryPoint[]> {
    const user = await getOrCreateUser();
    if (!user) return [];

    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    const [ownedCards, snapshots] = await Promise.all([
        prisma.collectionCard.findMany({
            where: { collection: { userId: user.id } },
            select: { cardId: true, quantity: true },
        }),
        prisma.priceSnapshot.findMany({
            where: { recordedAt: { gte: since } },
            orderBy: { recordedAt: "asc" },
            select: { cardId: true, price: true, currency: true, recordedAt: true },
        }),
    ]);

    const quantityByCard = new Map<string, number>();
    for (const card of ownedCards) {
        quantityByCard.set(
            card.cardId,
            (quantityByCard.get(card.cardId) ?? 0) + card.quantity,
        );
    }

    const valueByDate = new Map<string, PriceHistoryPoint>();
    for (const snapshot of snapshots) {
        const quantity = quantityByCard.get(snapshot.cardId);
        if (!quantity) continue;

        const date = snapshot.recordedAt.toISOString().split("T")[0];
        const existing = valueByDate.get(date);
        valueByDate.set(date, {
            date,
            price: (existing?.price ?? 0) + snapshot.price * quantity,
            currency: existing?.currency ?? snapshot.currency,
        });
    }

    return [...valueByDate.values()];
}

export async function getPortfolioSnapshotCount(): Promise<number> {
    const user = await getOrCreateUser();
    if (!user) return 0;

    const cards = await prisma.collectionCard.findMany({
        where: { collection: { userId: user.id } },
        select: { cardId: true },
        distinct: ["cardId"],
    });

    return prisma.priceSnapshot.count({
        where: { cardId: { in: cards.map((card) => card.cardId) } },
    });
}
