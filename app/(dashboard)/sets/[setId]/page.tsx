import { getCardsInSet } from "@/lib/tcgdex";
import SetClient from "./SetClient";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ setId: string }>;
}

export default async function SetPage({ params }: Props) {
    const { setId } = await params;
    try {
        const set = await getCardsInSet(setId);
        return <SetClient set={set} />;
    } catch (error) {
        console.error(`Failed to fetch set details for ${setId}:`, error);
        notFound();
    }
}