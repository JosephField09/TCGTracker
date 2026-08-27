"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma"
import { getOrCreateUser } from "@/lib/user";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@/generated/prisma/client/client";

interface AddCardInput {
    cardId: string;
    setId: string;
    cardName: string;
    setName: string;
    imageUrl: string;
    rarity?: string;
    variant: string;
    condition: string;
    quantity: number;
    notes?: string;
}

const CONDITION_MAP: Record<string, string> = {
    "Mint": "MINT",
    "Near Mint": "NEAR_MINT",
    "Lightly Played": "LIGHTLY_PLAYED",
    "Moderately Played": "MODERATELY_PLAYED",
    "Mod. Played": "MODERATELY_PLAYED",
    "Heavily Played": "HEAVILY_PLAYED",
    "Damaged": "DAMAGED",
};

export async function addVariantToCollection(input: AddCardInput){
    await auth.protect();
    const user = await getOrCreateUser();
    const collection = user?.collections[0];
    if (!collection) throw new Error("No collection found");

    const rawCondition = input.condition ?? "NEAR_MINT";
    const condition = (CONDITION_MAP[rawCondition] ?? rawCondition) as Prisma.CollectionCardCreateInput["condition"];
    const quantity = input.quantity ?? 1;

    const existing = await prisma.collectionCard.findFirst({
        where: {
            collectionId: collection.id,
            cardId: input.cardId,
            condition,
            variant: input.variant,
        },
    });

    if (existing) {
        await prisma.collectionCard.update({
            where: { id: existing.id },
            data: { quantity: existing.quantity + quantity },
        });
    } else {
        await prisma.collectionCard.create({
            data: {
                collectionId: collection.id,
                cardId: input.cardId,
                setId: input.setId,
                cardName: input.cardName,
                setName: input.setName,
                imageUrl: input.imageUrl,
                rarity: input.rarity,
                variant: input.variant,
                condition,
                quantity,
                notes: input.notes,
            },
        });
    }

    revalidatePath(`/sets/${input.setId}`);
    revalidatePath(`/cards/${input.cardId}`);
    return { success: true };
}

export async function removeVariantFromCollection(input: {
    cardId: string;
    setId: string;
    variant: string;
}) {
    await auth.protect();
    const user = await getOrCreateUser();
    if (!user) throw new Error("No user found");

    const card = await prisma.collectionCard.findFirst({
        where: {
            cardId: input.cardId,
            variant: input.variant,
            collection: { userId: user.id },
        },
    });

    if (!card) return { success: false };

    if (card.quantity > 1) {
        await prisma.collectionCard.update({
            where: { id: card.id },
            data: { quantity: card.quantity - 1 },
        });
    } else {
        await prisma.collectionCard.delete({
            where: { id: card.id },
        });
    }

    revalidatePath(`/sets/${input.setId}`);
    revalidatePath(`/cards/${input.cardId}`);
    return { success: true };
}

export async function getOwnedVariantMap(): Promise<Record<string, Record<string, number>>> {
    const { userId } = await auth();
    if (!userId) return {};

    const cards = await prisma.collectionCard.findMany({
        where: { collection: { userId } },
        select: { cardId: true, variant: true, quantity: true },
    });

    const map: Record<string, Record<string, number>> = {};
    for (const card of cards) {
        const variant = card.variant ?? "normal";
        if (!map[card.cardId]) map[card.cardId] = {};
        map[card.cardId][variant] = (map[card.cardId][variant] ?? 0) + card.quantity;
    }
    return map;
}