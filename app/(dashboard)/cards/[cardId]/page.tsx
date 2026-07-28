import { getCard } from "@/lib/tcgdex";
import { getOwnedVariantMap } from "@/app/actions/collection";
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
        return {
            title: `${card.name} | TCG Tracker`,
        };
    } catch (error) {
        return { 
            title: "Card not found | TCGTracker" 
        };
    }
}

export default async function CardPage({ params }: Props) {
    const { cardId } = await params;

    try {
        const [card, ownedVariantMap] = await Promise.all([
            getCard(cardId),
            getOwnedVariantMap(),
        ]);
        const ownedVariants = ownedVariantMap[cardId] ?? {};
        return <CardClient card={card} ownedVariants={ownedVariants} />;
    } catch {
        notFound();
    }
}