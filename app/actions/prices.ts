"use server";

import { prisma } from "@/lib/prisma";

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
