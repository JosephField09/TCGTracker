"use server";

import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";
import { getCard, getSet, getBestPrice } from "@/lib/tcgdex";

export interface DashboardStats {
    totalCards: number;
    totalSets: number;
    collectionValue: number;
    mostExpensiveCard: {
        name: string;
        setName: string;
        localId: string;
        value: number;
        imageUrl: string;
        cardId: string;
    } | null;
    setsComplete: number;
    setsInProgress: number;
}

export interface TopCard {
    cardId: string;
    cardName: string;
    setName: string;
    localId: string;
    imageUrl: string;
    value: number;
    quantity: number;
}

export interface SetProgress {
    setId: string;
    setName: string;
    owned: number;
    total: number;
    isComplete: boolean;
}

export interface RecentActivity {
    id: string;
    cardName: string;
    setName: string;
    rarity: string | null;
    imageUrl: string;
    cardId: string;
    addedAt: Date;
    quantity: number;
}

export async function getDashboardData() {
    const user = await getOrCreateUser();
    if (!user) throw new Error("No user found");
    const ownedCards = await prisma.collectionCard.findMany({
        where: { collection: { userId: user.id } },
        orderBy: { createdAt: "desc" },
    });

    if (ownedCards.length === 0) {
        return {
            stats: {
                totalCards: 0,
                totalSets: 0,
                collectionValue: 0,
                mostExpensiveCard: null,
                setsComplete: 0,
                setsInProgress: 0,
            } as DashboardStats,
            topCards: [] as TopCard[],
            setProgress: [] as SetProgress[],
            recentActivity: [] as RecentActivity[],
        };
    }

    const uniqueSetIds = [...new Set(ownedCards.map((c) => c.setId))];
    const uniqueCardIds = [...new Set(ownedCards.map((c) => c.cardId))];

    const [cardDetails, setDetails] = await Promise.all([
        Promise.all(
            uniqueCardIds.map(async (cardId) => {
                try {
                    const card = await getCard(cardId);
                    return { cardId, card };
                } catch {
                    return { cardId, card: null };
                }
            }),
        ),
        Promise.all(
            uniqueSetIds.map(async (setId) => {
                try {
                    const set = await getSet(setId);
                    return { setId, set };
                } catch {
                    return { setId, set: null };
                }
            }),
        ),
    ]);

    const cardMap = Object.fromEntries(
        cardDetails.map(({ cardId, card }) => [cardId, card]),
    );
    const setMap = Object.fromEntries(
        setDetails.map(({ setId, set }) => [setId, set]),
    );

    const cardValues = uniqueCardIds.map((cardId) => {
        const card = cardMap[cardId];
        const { price } = getBestPrice(card?.pricing);
        return { cardId, price: price ?? 0 };
    });
    const valueByCardId = Object.fromEntries(
        cardValues.map(({ cardId, price }) => [cardId, price]),
    );

    const totalCards = ownedCards.reduce((sum, c) => sum + c.quantity, 0);

    const collectionValue = ownedCards.reduce((sum, c) => {
        return sum + (valueByCardId[c.cardId] ?? 0) * c.quantity;
    }, 0);

    const cardValueMap: Record<string, TopCard> = {};
    for (const owned of ownedCards) {
        const card = cardMap[owned.cardId];
        const value = valueByCardId[owned.cardId] ?? 0;
        if (
            !cardValueMap[owned.cardId] ||
            value > cardValueMap[owned.cardId].value
        ) {
            cardValueMap[owned.cardId] = {
                cardId: owned.cardId,
                cardName: owned.cardName,
                setName: owned.setName,
                localId: card?.localId ?? "",
                imageUrl: owned.imageUrl,
                value,
                quantity: owned.quantity,
            };
        }
    }
    const topCards = Object.values(cardValueMap)
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    const mostExpensiveCard = topCards[0]
        ? {
              name: topCards[0].cardName,
              setName: topCards[0].setName,
              localId: topCards[0].localId,
              value: topCards[0].value,
              imageUrl: topCards[0].imageUrl,
              cardId: topCards[0].cardId,
          }
        : null;

    const ownedCardIdsBySet: Record<string, Set<string>> = {};
    for (const card of ownedCards) {
        if (!ownedCardIdsBySet[card.setId]) {
            ownedCardIdsBySet[card.setId] = new Set();
        }
        ownedCardIdsBySet[card.setId].add(card.cardId);
    }

    const setProgress: SetProgress[] = uniqueSetIds
        .map((setId) => {
            const set = setMap[setId];
            const total = set?.cardCount.official ?? 0;
            const owned = ownedCardIdsBySet[setId]?.size ?? 0;
            return {
                setId,
                setName: set?.name ?? setId,
                owned,
                total,
                isComplete: total > 0 && owned >= total,
            };
        })
        .sort((a, b) => b.owned / b.total - a.owned / a.total);

    const setsComplete = setProgress.filter((s) => s.isComplete).length;
    const setsInProgress = setProgress.filter((s) => !s.isComplete).length;

    const recentActivity: RecentActivity[] = ownedCards
        .slice(0, 8)
        .map((c) => ({
            id: c.id,
            cardName: c.cardName,
            setName: c.setName,
            rarity: c.rarity,
            imageUrl: c.imageUrl,
            cardId: c.cardId,
            addedAt: c.createdAt,
            quantity: c.quantity,
        }));

    return {
        stats: {
            totalCards,
            totalSets: uniqueSetIds.length,
            collectionValue,
            mostExpensiveCard,
            setsComplete,
            setsInProgress,
        } as DashboardStats,
        topCards,
        setProgress,
        recentActivity,
    };
}
