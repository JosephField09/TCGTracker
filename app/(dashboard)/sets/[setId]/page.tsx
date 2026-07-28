import { getCardsInSet } from "@/lib/tcgdex";
import { getOwnedVariantMap } from "@/app/actions/collection";
import SetClient from "./SetClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "force-cache";

interface Props {
    params: Promise<{ setId: string }>;
}

export default async function SetPage({ params }: Props) {
    const { setId } = await params;
    try {
        const [set, ownedVariantMap] = await Promise.all([
            getCardsInSet(setId),
            getOwnedVariantMap(),
        ]);

        return <SetClient set={set} ownedVariantMap={ownedVariantMap} />;
    } catch (error) {
        console.error(`Failed to fetch set details for ${setId}:`, error);
        notFound();
    }
}