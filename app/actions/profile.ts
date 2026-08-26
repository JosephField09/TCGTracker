"use server";

import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";
import { getCard, getBestPrice } from "@/lib/tcgdex";
import { normalisePokemonName } from "@/lib/naming";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export interface CollectionWithStats {
    id: string;
    name: string;
    description: string | null;
    cardCount: number;
    setCount: number;
    estimatedValue: number;
    icon: string;
}

export interface RarityBreakdown {
    rarity: string;
    count: number;
    colour: string;
}

export interface ProfileData {
    username: string;
    memberSince: Date;
    totalCards: number;
    estimatedValue: number;
    setsCollected: number;
    setsCompleted: number;
    collections: CollectionWithStats[];
    rarityBreakdown: RarityBreakdown[];
    mostCollectedPokemon: string | null;
    triggeredAlertCount: number;
}

const RARITY_COLOURS: Record<string, string> = {
    Common: "#4A4270",
    Uncommon: "#1F5280",
    Rare: "#2A2A2A",
    "Double Rare": "#555555",
    "Illustration Rare": "#1E6030",
    "Ultra Rare": "#1A4A8A",
    "Mega Attack Rare": "#8A2060",
    "Special Illustration Rare": "#9A6A00",
    "Mega Hyper Rare": "#7A5800",
};

const COLLECTION_ICONS = [
    "📚", "⚡", "🔄", "🏆", "💎", "🌟"
];


export async function getProfileData(): Promise<ProfileData> {
    const user = await getOrCreateUser();
    const { userId } = await auth();
    if (!userId || !user) throw new Error("Unauthenticated");

    const collections = await prisma.collection.findMany({
        where: { userId: user.id },
        include: {
            cards: {
                select: {
                    cardId: true,
                    setId: true,
                    quantity: true,
                    rarity: true,
                    cardName: true,
                },
            },
        },
    });

    const allCards = collections.flatMap((c) => c.cards);
    const uniqueCardIds = [...new Set(allCards.map((c) => c.cardId))];
    const cardPrices = await Promise.all(
        uniqueCardIds.map(async (cardId) => {
            try {
                const card = await getCard(cardId);
                const { price } = getBestPrice(card.pricing);
                return { cardId, price: price ?? 0 };
            } catch {
                return { cardId, price: 0 };
            }
        }),
    );
    const priceMap = Object.fromEntries(
        cardPrices.map(({ cardId, price }) => [cardId, price]),
    );

    const totalCards = allCards.reduce((sum, c) => sum + c.quantity, 0);
    const estimatedValue = allCards.reduce(
        (sum, c) => sum + (priceMap[c.cardId] ?? 0) * c.quantity,
        0,
    );
    const uniqueSetIds = [...new Set(allCards.map((c) => c.setId))];
    const setsCollected = uniqueSetIds.length;

    const cardsBySet: Record<string, Set<string>> = {};
    for (const card of allCards) {
        if (!cardsBySet[card.setId]) cardsBySet[card.setId] = new Set();
        cardsBySet[card.setId].add(card.cardId);
    }
    const setsCompleted = 0;
    const collectionsWithStats: CollectionWithStats[] = collections.map(
        (col, i) => {
            const colValue = col.cards.reduce(
                (sum, c) => sum + (priceMap[c.cardId] ?? 0) * c.quantity,
                0,
            );
            const colSetIds = new Set(col.cards.map((c) => c.setId));
            return {
                id: col.id,
                name: col.name,
                description: col.description,
                cardCount: col.cards.reduce((sum, c) => sum + c.quantity, 0),
                setCount: colSetIds.size,
                estimatedValue: colValue,
                icon: COLLECTION_ICONS[i % COLLECTION_ICONS.length],
            };
        },
    );

    const rarityCounts: Record<string, number> = {};
    for (const card of allCards) {
        const r = card.rarity ?? "Unknown";
        rarityCounts[r] = (rarityCounts[r] ?? 0) + card.quantity;
    }
    const rarityBreakdown: RarityBreakdown[] = Object.entries(rarityCounts)
        .map(([rarity, count]) => ({
            rarity,
            count,
            colour: RARITY_COLOURS[rarity] ?? "#A89EC4",
        }))
        .sort((a, b) => b.count - a.count);

    const nameCounts: Record<string, number> = {};
    for (const card of allCards) {
        const base = normalisePokemonName(card.cardName);
        nameCounts[base] = (nameCounts[base] ?? 0) + card.quantity;
    }
    const mostCollectedPokemon = Object.entries(nameCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    const triggeredAlertCount = await prisma.priceAlert.count({
        where: { userId: user.id, triggered: true },
    });
    console.log(mostCollectedPokemon)

    return {
        username: user.username,
        memberSince: user.createdAt,
        totalCards,
        estimatedValue,
        setsCollected,
        setsCompleted,
        collections: collectionsWithStats,
        rarityBreakdown,
        mostCollectedPokemon,
        triggeredAlertCount,
    };
}

export async function createCollection(name: string) {
    const user = await getOrCreateUser();
    if (!user) throw new Error("No user found");
    await prisma.collection.create({
        data: {
            name,
            userId: user.id,
        },
    });
    revalidatePath("/profile");
}

export async function renameCollection(id: string, name: string) {
    const user = await getOrCreateUser();
    if (!user) throw new Error("No user found");
    await prisma.collection.updateMany({
        where: { id, userId: user.id },
        data: { name },
    });
    revalidatePath("/profile");
}

export async function deleteCollection(id: string) {
    const user = await getOrCreateUser();
    if (!user) throw new Error("No user found");
    const count = await prisma.collection.count({
        where: { userId: user.id },
    });
    if (count <= 1) throw new Error("Cannot delete your only collection");

    await prisma.collection.deleteMany({
        where: { id, userId: user.id },
    });
    revalidatePath("/profile");
}

export async function getCollectionCsvData() {
    const user = await getOrCreateUser();
    if (!user) throw new Error("No user found");
    const cards = await prisma.collectionCard.findMany({
        where: { collection: { userId: user.id } },
        orderBy: [{ setId: "asc" }, { cardName: "asc" }],
    });

    const uniqueCardIds = [...new Set(cards.map((c) => c.cardId))];
    const cardPrices = await Promise.all(
        uniqueCardIds.map(async (cardId) => {
            try {
                const card = await getCard(cardId);
                const { price } = getBestPrice(card.pricing);
                return { cardId, price };
            } catch {
                return { cardId, price: null };
            }
        }),
    );
    const priceMap = Object.fromEntries(
        cardPrices.map(({ cardId, price }) => [cardId, price]),
    );

    return cards.map((card) => ({
        cardName: card.cardName,
        set: card.setName,
        cardId: card.cardId,
        variant: card.variant ?? "normal",
        condition: card.condition,
        quantity: card.quantity,
        marketValue: priceMap[card.cardId] ?? "",
        notes: card.notes ?? "",
    }));
}
