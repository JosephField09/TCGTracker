"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export interface AlertWithPrice {
    id: string;
    cardId: string;
    cardName: string;
    setName: string;
    imageUrl: string;
    targetPrice: number;
    direction: "ABOVE" | "BELOW";
    triggered: boolean;
    triggeredAt: Date | null;
    currentPrice: number | null;
    currency: string;
    createdAt: Date;
}

export async function getAlerts(): Promise<AlertWithPrice[]> {
    const user = await getOrCreateUser();
    if (!user) return [];

    const alerts = await prisma.priceAlert.findMany({
        where: { userId: user.id },
        orderBy: [{ triggered: "asc" }, { createdAt: "desc" }],
    });

    // Get latest price snapshot for each card
    const cardIds = [...new Set(alerts.map((a) => a.cardId))];
    const latestSnapshots = await Promise.all(
        cardIds.map(async (cardId) => {
            const snapshot = await prisma.priceSnapshot.findFirst({
                where: { cardId },
                orderBy: { recordedAt: "desc" },
            });
            return { cardId, snapshot };
        }),
    );
    const snapshotMap = Object.fromEntries(
        latestSnapshots.map(({ cardId, snapshot }) => [cardId, snapshot]),
    );

    return alerts.map((alert) => {
        const snapshot = snapshotMap[alert.cardId];
        return {
            id: alert.id,
            cardId: alert.cardId,
            cardName: alert.cardName,
            setName: alert.setName ?? "",
            imageUrl: alert.imageUrl ?? "",
            targetPrice: alert.targetPrice,
            direction: alert.direction as "ABOVE" | "BELOW",
            triggered: alert.triggered,
            triggeredAt: alert.triggeredAt ?? null,
            currentPrice: snapshot?.price ?? null,
            currency: snapshot?.currency ?? "EUR",
            createdAt: alert.createdAt,
        };
    });
}

export async function getTriggeredAlertCount(): Promise<number> {
    const { userId } = await auth();
    if (!userId) return 0;
    
    return prisma.priceAlert.count({
        where: { userId, triggered: true },
    });
}

export async function createAlert(input: {
    cardId: string;
    cardName: string;
    setName: string;
    imageUrl: string;
    targetPrice: number;
    direction: "ABOVE" | "BELOW";
}) {
    await auth.protect();
    const user = await getOrCreateUser();
    if (!user) throw new Error("Unable to identify user");

    await prisma.priceAlert.create({
        data: {
            userId: user.id,
            cardId: input.cardId,
            cardName: input.cardName,
            setName: input.setName,
            imageUrl: input.imageUrl,
            targetPrice: input.targetPrice,
            direction: input.direction,
        },
    });

    revalidatePath("/alerts");
    revalidatePath(`/cards/${input.cardId}`);
    return { success: true };
}

export async function deleteAlert(id: string) {
    await auth.protect();
    const user = await getOrCreateUser();
    if (!user) throw new Error("Unable to identify user");
    await prisma.priceAlert.deleteMany({
        where: { id, userId: user.id },
    });
    revalidatePath("/alerts");
    return { success: true };
}

export async function resetAlert(id: string) {
    await auth.protect();
    const user = await getOrCreateUser();
    if (!user) throw new Error("Unable to identify user");
    await prisma.priceAlert.updateMany({
        where: { id, userId: user.id },
        data: {
            triggered: false,
            triggeredAt: null,
        },
    });
    revalidatePath("/alerts");
    return { success: true };
}

export async function updateAlertTarget(id: string, targetPrice: number) {
    await auth.protect();
    const user = await getOrCreateUser();
    if (!user) throw new Error("Unable to identify user");
    await prisma.priceAlert.updateMany({
        where: { id, userId: user.id },
        data: {
            targetPrice,
            triggered: false,
            triggeredAt: null,
        },
    });
    revalidatePath("/alerts");
    return { success: true };
}
