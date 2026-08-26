import { getCard } from "@/lib/tcgdex";
import { getOwnedVariantMap } from "@/app/actions/collection";
import { getPriceHistory, getSnapshotCount } from "@/app/actions/prices";
import CardClient from "./CardClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ cardId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { cardId } = await params;
    try {
        const card = await getCard(cardId);
        return { title: `${card.name} | TCGTracker` };
    } catch {
        return { title: "Card not found | TCGTracker" };
    }
}

export default async function CardPage({ params }: Props) {
    const { cardId } = await params;

    let card;
    let ownedVariantMap: Record<string, Record<string, number>> = {};
    let priceHistory = [];
    let snapshotCount = 0;

    try {
        [card, ownedVariantMap, priceHistory, snapshotCount] = await Promise.all([
            getCard(cardId),
            getOwnedVariantMap(),
            getPriceHistory(cardId, 30),
            getSnapshotCount(cardId),
        ]);
    } catch {
        notFound();
    }

    if (!card) {
        notFound();
    }

    const ownedVariants = ownedVariantMap[cardId] ?? {};

    return (
        <CardClient
            card={card}
            ownedVariants={ownedVariants}
            initialPriceHistory={priceHistory}
            snapshotCount={snapshotCount}
        />
    );
}
