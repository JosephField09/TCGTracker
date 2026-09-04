"use server";

import { prisma } from "@/lib/prisma";

export interface SearchFilters {
    query?: string;
    type?: string;
    rarity?: string;
    category?: string;
    illustrator?: string;
    page?: number;
}

export interface SearchResults {
    cards: SearchCard[];
    total: number;
    page: number;
    totalPages: number;
}

export interface SearchCard {
    id: string;
    localId: string;
    name: string;
    image: string | null;
    rarity: string | null;
    types: string[];
    illustrator: string | null;
    category: string | null;
    variants: any;
    setId: string;
    set: {
        id: string;
        name: string;
    };
}

const PAGE_SIZE = 30;

export async function searchCards(
    filters: SearchFilters
): Promise<SearchResults> {
    const page = filters.page ?? 1;
    const skip = (page - 1) * PAGE_SIZE;

    const where: any = {};

    if (filters.query) {
        where.OR = [
            { name: { contains: filters.query, mode: "insensitive" } },
            { illustrator: { contains: filters.query, mode: "insensitive" } },
            { set: { name: { contains: filters.query, mode: "insensitive" } } },
        ];
    }

    if (filters.type) {
        where.types = { has: filters.type };
    }

    if (filters.rarity) {
        where.rarity = { equals: filters.rarity, mode: "insensitive" };
    }

    if (filters.category) {
        where.category = { equals: filters.category, mode: "insensitive" };
    }

    if (filters.illustrator) {
        where.illustrator = {
            contains: filters.illustrator,
            mode: "insensitive",
        };
    }

    const [cards, total] = await Promise.all([
        prisma.tcgCard.findMany({
            where,
            include: {
                set: { select: { id: true, name: true } },
            },
            orderBy: { name: "asc" },
            skip,
            take: PAGE_SIZE,
        }),
        prisma.tcgCard.count({ where }),
    ]);

    return {
        cards,
        total,
        page,
        totalPages: Math.ceil(total / PAGE_SIZE),
    };
}

export async function getSearchFilters() {
    const [types, rarities, illustrators] = await Promise.all([
        prisma.tcgCard.findMany({
            select: { types: true },
            distinct: ["types"],
        }),
        prisma.tcgCard.findMany({
            where: { rarity: { not: null } },
            select: { rarity: true },
            distinct: ["rarity"],
            orderBy: { rarity: "asc" },
        }),
        prisma.tcgCard.findMany({
            where: { illustrator: { not: null } },
            select: { illustrator: true },
            distinct: ["illustrator"],
            orderBy: { illustrator: "asc" },
        }),
    ]);

    const allTypes = [...new Set(types.flatMap((t) => t.types))].sort();
    const allRarities = rarities.map((r) => r.rarity!);
    const allIllustrators = illustrators.map((i) => i.illustrator!);

    return {
        types: allTypes,
        rarities: allRarities,
        illustrators: allIllustrators,
    };
}