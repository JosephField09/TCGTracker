import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCard, getBestPrice } from "@/lib/tcgdex";
import { sendAlertEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get("secret");
    const cronSecret = process.env.CRON_SECRET;

    if (!secret || secret !== cronSecret) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const uniqueCards = [
            ...new Set([
                ...(
                    await prisma.collectionCard.findMany({
                        select: { cardId: true },
                        distinct: ["cardId"],
                    })
                ).map((x) => x.cardId),

                ...(
                    await prisma.priceAlert.findMany({
                        select: { cardId: true },
                        distinct: ["cardId"],
                    })
                ).map((x) => x.cardId),
            ]),
        ].map((cardId) => ({ cardId }));

        const cardIds = uniqueCards.map((c) => c.cardId);
        console.log(`Snapshotting prices for ${cardIds.length} unique cards`);

        let success = 0;
        let failed = 0;

        const BATCH_SIZE = 20;
        for (let i = 0; i < cardIds.length; i += BATCH_SIZE) {
            const batch = cardIds.slice(i, i + BATCH_SIZE);
            await Promise.all(
                batch.map(async (cardId) => {
                    try {
                        const card = await getCard(cardId);
                        const { price, currency, source } = getBestPrice(
                            card.pricing,
                        );
                        if (price === null) return;

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
                                data: {
                                    price,
                                    source,
                                    currency,
                                },
                            });
                        } else {
                            await prisma.priceSnapshot.create({
                                data: {
                                    cardId,
                                    source,
                                    condition: "NEAR_MINT",
                                    price,
                                    currency,
                                },
                            });
                        }
                        success++;
                    } catch (error) {
                        console.error(
                            `Failed to snapshot price for cardId ${cardId}:`,
                            error,
                        );
                        failed++;
                    }
                }),
            );

            if (i + BATCH_SIZE < cardIds.length) {
                await new Promise((resolve) => setTimeout(resolve, 500));
            }
        }

        async function checkAlerts() {
            const activeAlerts = await prisma.priceAlert.findMany({
                where: { triggered: false },
                include: { user: { select: { email: true } } },
            });
            console.log(`Checking ${activeAlerts.length} active price alerts`);

            for (const alert of activeAlerts) {
                const snapshot = await prisma.priceSnapshot.findFirst({
                    where: { cardId: alert.cardId },
                    orderBy: { recordedAt: "desc" },
                });

                if (!snapshot) continue;

                const currentPrice = snapshot.price;
                const shouldTrigger =
                    (alert.direction === "ABOVE" &&
                        currentPrice > alert.targetPrice) ||
                    (alert.direction === "BELOW" &&
                        currentPrice < alert.targetPrice);

                if (shouldTrigger) {
                    await prisma.priceAlert.update({
                        where: { id: alert.id },
                        data: { triggered: true, triggeredAt: new Date() },
                    });

                    // Send email notification
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
                        console.log(
                            `Sent alert email to ${alert.user.email} for cardId ${alert.cardId}`,
                        );
                    } catch (error) {
                        console.error(
                            `Failed to send alert email to ${alert.user.email} for cardId ${alert.cardId}:`,
                            error,
                        );
                    }
                }
            }
        }
        await checkAlerts();

        return NextResponse.json({
            success: true,
            snapshotted: success,
            failed,
            total: cardIds.length,
        });
    } catch (error) {
        console.error("Error during price snapshot:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}
