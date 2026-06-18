const BASE = "https://api.tcgdex.net/v2/en";

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
    hp?: number;
    illustrator?: string;
    releaseDate?: string;
    set: {
        id: string;
        name: string;
    };
}

export interface TcgSetDetail extends TcgSet {
    cards: TcgCard[];
    serie: { id: string; name: string };
    releaseDate: string;
    legal: { standard: boolean; expanded: boolean };
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
            return{
                id: serie.id,
                name: serie.name,
                logo: serie.logo,
                sets: (data.sets as TcgSet[]) ?? [],
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