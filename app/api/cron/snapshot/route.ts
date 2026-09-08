import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCard, getBestPrice, getLivePrice } from "@/lib/tcgdex";
import { sendAlertEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BATCH_SIZE = 50;
const STALE_THRESHOLD_MS = 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get("secret");
    const cronSecret = process.env.CRON_SECRET;

    if (!secret || secret !== cronSecret) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const startTime = Date.now();

    try {
        const staleThreshold = new Date(Date.now() - STALE_THRESHOLD_MS);
        const cards = await prisma.tcgCard.findMany({
            where: {
                OR: [
                    { lastSnapshotted: null },
                    { lastSnapshotted: { lt: staleThreshold } },
                ],
            },
            orderBy: { lastSnapshotted: "asc" },
            take: BATCH_SIZE,
            select: { id: true },
        });

        if (cards.length === 0) {
            await checkAlerts();
            return NextResponse.json({
                success: true,
                message: "All cards up to date",
                processed: 0,
                elapsed: Date.now() - startTime,
            });
        }
        const cardIds = cards.map((c) => c.id);
        console.log(`Snapshotting prices for ${cardIds.length} unique cards`);

        let success = 0;
        let failed = 0;
        let noPrice = 0;

        await Promise.all(
            cardIds.map(async (cardId) => {
                try {
                    const { price, currency, source } =
                        await getLivePrice(cardId);

                    if (price === null) {
                        noPrice++;
                        // Still mark as attempted so we don't retry too soon
                        await prisma.tcgCard.update({
                            where: { id: cardId },
                            data: { lastSnapshotted: new Date() },
                        });
                        return;
                    }

                    // Check if we already have a snapshot for today
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const existing = await prisma.priceSnapshot.findFirst({
                        where: {
                            cardId,
                            recordedAt: { gte: today },
                        },
                    });

                    if (existing) {
                        await prisma.priceSnapshot.update({
                            where: { id: existing.id },
                            data: { price, currency, source },
                        });
                    } else {
                        await prisma.priceSnapshot.create({
                            data: {
                                cardId,
                                price,
                                currency,
                                source,
                                condition: "NEAR_MINT",
                            },
                        });
                    }

                    // Mark card as freshly snapshotted
                    await prisma.tcgCard.update({
                        where: { id: cardId },
                        data: { lastSnapshotted: new Date() },
                    });

                    success++;
                } catch (err) {
                    console.error(`Failed to snapshot ${cardId}:`, err);
                    failed++;
                }
            }),
        );

        // Check how many cards still need updating
        const remaining = await prisma.tcgCard.count({
            where: {
                OR: [
                    { lastSnapshotted: null },
                    { lastSnapshotted: { lt: staleThreshold } },
                ],
            },
        });

        const alertsTriggered = await checkAlerts();

        const elapsed = Date.now() - startTime;
        console.log(
            `Snapshot complete: ${success} success, ${failed} failed, ${noPrice} no price, ${elapsed}ms`,
        );

        return NextResponse.json({
            success: true,
            processed: cardIds.length,
            snapshotted: success,
            failed,
            noPrice,
            remaining,
            alertsTriggered,
            elapsed,
        });
    } catch (error) {
        console.error("Error during price snapshot:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}

async function checkAlerts(): Promise<number> {
    const activeAlerts = await prisma.priceAlert.findMany({
        where: { triggered: false },
        include: { user: { select: { email: true } } },
    });

    if (activeAlerts.length === 0) return 0;

    let triggered = 0;

    for (const alert of activeAlerts) {
        const snapshot = await prisma.priceSnapshot.findFirst({
            where: { cardId: alert.cardId },
            orderBy: { recordedAt: "desc" },
        });

        if (!snapshot) continue;

        const currentPrice = snapshot.price;
        const shouldTrigger =
            (alert.direction === "ABOVE" && currentPrice > alert.targetPrice) ||
            (alert.direction === "BELOW" && currentPrice < alert.targetPrice);

        if (shouldTrigger) {
            await prisma.priceAlert.update({
                where: { id: alert.id },
                data: { triggered: true, triggeredAt: new Date() },
            });

            try {
                await sendAlertEmail({
                    to: alert.user.email,
                    cardName: alert.cardName,
                    setName: alert.setName ?? "",
                    cardId: alert.cardId,
                    targetPrice: alert.targetPrice,
                    currentPrice,
                    direction: alert.direction as "ABOVE" | "BELOW",
                    currency: snapshot.currency,
                });
                triggered++;
            } catch (err) {
                console.error(
                    `Failed to send alert email for ${alert.cardId}:`,
                    err,
                );
            }
        }
    }

    return triggered;
}
