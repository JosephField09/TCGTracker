const BASE = "https://api.eu2.tcgdex.net/v2/en";

export interface TcgSet {
    id: string;
    name: string;
    logo?: string;
    symbol?: string;
    cardCount: {
        total: number;
        official: number;
    };
    releaseDate?: string;
}

export interface TcgSerie {
    id: string;
    name: string;
    logo?: string;
    sets: TcgSet[];
}

export interface TcgCard {
    id: string;
    localId: string;
    name: string;
    image?: string;
}

export interface TcgCardDetail {
    id: string;
    localId: string;
    name: string;
    image?: string;
    rarity?: string;
    types?: string[];
    dexId?: number[];
    hp?: number;
    illustrator?: string;
    category?: string;
    stage?: string;
    description?: string;
    evolveFrom?: string;
    attacks?: {
        name: string;
        cost: string[];
        damage?: number;
        effect?: string;
    }[];
    weaknesses?: {
        type: string;
        value: string;
    }[];
    retreat?: number;
    variants?: {
        firstEdition: boolean;
        holo: boolean;
        normal: boolean;
        reverse: boolean;
    };
    regulationMark?: string;
    legal?: {
        standard: boolean;
        expanded: boolean;
    };
    set: {
        id: string;
        name: string;
        logo?: string;
        cardCount: {
        official: number;
        total: number;
        };
    };
    pricing?: CardPricing;
}

export interface TcgSetDetail<TCard extends TcgCard = TcgCard> extends TcgSet {
    cards: TCard[];
    serie: { id: string; name: string };
    releaseDate: string;
    legal: { standard: boolean; expanded: boolean };
}

export interface CardPricing {
    cardmarket?: {
        updated: string;
        unit: string;
        avg: number;
        low: number;
        trend: number;
        avg1: number;
        avg7: number;
        avg30: number;
        "avg-holo"?: number;
        "low-holo"?: number;
        "trend-holo"?: number;
    };
    tcgplayer?: {
        unit: string;
        updated: string;
        normal?: {
        lowPrice: number;
        midPrice: number;
        highPrice: number;
        marketPrice: number;
        };
    "reverse-holofoil"?: {
        lowPrice: number;
        midPrice: number;
        highPrice: number;
        marketPrice: number;
        };
    };
}



// Fetch all series
export async function getSeries(): Promise<TcgSerie[]> {
    const seriesRes  = await fetch(`${BASE}/series`, {
        next: { revalidate: 60 * 60 * 24 }, // Revalidate every 24 hours
    });
    if (!seriesRes.ok) {
        throw new Error(`Failed to fetch series: ${seriesRes.statusText}`);
    }
    const seriesList: { id: string; name: string; logo?: string }[] = await seriesRes.json();
    const idsToRemove = new Set(["pop", "misc", "tk", "tcgp"]);
    for (let i = seriesList.length - 1; i >= 0; i--) {
        if (idsToRemove.has(seriesList[i].id)) {
            seriesList.splice(i, 1);
        }
    }

    // Fetch each series' sets in parallel
    const series = await Promise.all(
        seriesList.map(async (serie) => {
            const setsRes = await fetch(`${BASE}/series/${serie.id}`, {
                next: { revalidate: 60 * 60 * 24 },
            });
            if (!setsRes.ok) {
                return { ...serie, sets: [] }; // Return empty sets if fetch fails
            }
            const data = await setsRes.json();
            const sets = await Promise.all(
                ((data.sets as TcgSet[]) ?? []).map(async (set) => {
                    try {
                        const detail = await getSet(set.id);
                        return { ...set, releaseDate: detail.releaseDate };
                    } catch {
                        return set;
                    }
                }),
            );
            return{
                id: serie.id,
                name: serie.name,
                logo: serie.logo,
                sets,
            };
        })
    );
    return series.filter((s) => s.sets.length > 0);
}

// Fetch single set details
export async function getSet(setId: string): Promise<TcgSetDetail> {
    const res = await fetch(`${BASE}/sets/${setId}`, {
        next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch set details: ${res.statusText}`);
    }
    return res.json();
}

// Fetch all cards in a set with full details
export async function getCardsInSet(setId: string): Promise<TcgSetDetail<TcgCardDetail>> {
    const set = await getSet(setId);
    const cards = await Promise.all(
        set.cards.map(async (card) => {
            try {
                const res = await fetch(`${BASE}/cards/${card.id}`, {
                    next: { revalidate: 60 * 60 },
                });
                if (!res.ok) {
                    return {
                        ...card,
                        set: {
                            id: set.id,
                            name: set.name,
                            cardCount: set.cardCount,
                        },
                        rarity: undefined,
                        pricing: undefined,
                    };
                }
                return res.json() as Promise<TcgCardDetail>;
            } catch (error) {
                console.error(`Failed to fetch card details for ${card.id}:`, error);
                return {
                    ...card,
                    set: {
                        id: set.id,
                        name: set.name,
                        cardCount: set.cardCount,
                    },
                    rarity: undefined,
                    pricing: undefined,
                };
            }
        })
    );
    return { ...set, cards };
}

// Fetch single card details
export async function getCard(cardId: string): Promise<TcgCardDetail> {
    const res = await fetch(`${BASE}/cards/${cardId}`, {
        next: { revalidate: 60 * 60 },
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch card details: ${res.statusText}`);
    }
    return res.json();
}

export function getBestPrice(pricing?: CardPricing): {
    price: number | null;
    currency: string;
    source: string;
    updatedAt: string;
} {
    if (pricing?.cardmarket?.trend) {
        return {
            price: pricing.cardmarket.trend,
            currency: "EUR",
            source: "Cardmarket",
            updatedAt: pricing.cardmarket.updated
        };
    }
    if (pricing?.tcgplayer?.normal?.marketPrice) {
        return {
            price: pricing.tcgplayer.normal.marketPrice,
            currency: "USD",
            source: "TCGPlayer",
            updatedAt: pricing.tcgplayer.updated
        };
    }
    return { price: null, currency: "EUR", source: "Unknown", updatedAt: "Unknown" };
}