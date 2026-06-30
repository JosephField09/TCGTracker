import { getCard } from "@/lib/tcgdex";
import CardClient from "./CardClient";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ cardId: string }>;
}

export async function generateMetadata({ params }: Props) {
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
        const card = await getCard(cardId);
        return <CardClient card={card} />;
    } catch {
        notFound();
    }
}