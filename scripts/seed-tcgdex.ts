import { PrismaClient } from "../generated/prisma/client/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const BASE = "https://api.tcgdex.net/v2/en";
const EXCLUDED_SERIES_NAMES = new Set([
    "pokémon tcg pocket",
    "trainer kits",
    "pop",
    "miscellaneous",
]);

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url, {
                signal: AbortSignal.timeout(15000),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
            return res.json();
        } catch (err) {
            if (i === retries - 1) throw err;
            console.log(`Retry ${i + 1}/${retries} for ${url}`);
            await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
        }
    }
}

async function seedSeries() {
    console.log("Fetching series list...");
    const seriesList = await fetchWithRetry(`${BASE}/series`);

    for (const serie of seriesList) {
        if (EXCLUDED_SERIES_NAMES.has(serie.name.trim().toLowerCase())) {
            console.log(`\nSkipping excluded serie: ${serie.name}`);
            continue;
        }

        console.log(`\nProcessing serie: ${serie.name}`);
        let serieDetail: any;
        try {
            serieDetail = await fetchWithRetry(`${BASE}/series/${serie.id}`);
        } catch {
            console.log(`Skipping serie ${serie.id} — fetch failed`);
            continue;
        }

        const sets: any[] = serieDetail.sets ?? [];
        console.log(`  Found ${sets.length} sets`);

        for (const setStub of sets) {
            // Fetch full set detail
            let setDetail: any;
            try {
                setDetail = await fetchWithRetry(`${BASE}/sets/${setStub.id}`);
            } catch {
                console.log(`  Skipping set ${setStub.id} — fetch failed`);
                continue;
            }

            // Upsert set
            await prisma.tcgSet.upsert({
                where: { id: setDetail.id },
                create: {
                    id: setDetail.id,
                    name: setDetail.name,
                    serie: serie.id,
                    serieName: serie.name,
                    logo: setDetail.logo ?? null,
                    symbol: setDetail.symbol ?? null,
                    cardCount: setDetail.cardCount?.official ?? 0,
                    releaseDate: setDetail.releaseDate ?? null,
                    legal: setDetail.legal ?? null,
                },
                update: {
                    name: setDetail.name,
                    logo: setDetail.logo ?? null,
                    symbol: setDetail.symbol ?? null,
                    cardCount: setDetail.cardCount?.official ?? 0,
                    releaseDate: setDetail.releaseDate ?? null,
                    legal: setDetail.legal ?? null,
                },
            });

            console.log(
                `  Set ${setDetail.id} (${setDetail.name}) — ${setDetail.cards?.length ?? 0} cards`,
            );

            // Process cards in batches of 10
            const cards: any[] = setDetail.cards ?? [];
            const BATCH = 10;

            for (let i = 0; i < cards.length; i += BATCH) {
                const batch = cards.slice(i, i + BATCH);

                await Promise.all(
                    batch.map(async (cardStub: any) => {
                        let card: any;
                        try {
                            card = await fetchWithRetry(
                                `${BASE}/cards/${cardStub.id}`,
                            );
                        } catch {
                            console.log(`    Skipping card ${cardStub.id}`);
                            return;
                        }

                        await prisma.tcgCard.upsert({
                            where: { id: card.id },
                            create: {
                                id: card.id,
                                localId: card.localId ?? "",
                                name: card.name ?? "",
                                image: card.image ?? null,
                                rarity: card.rarity ?? null,
                                types: card.types ?? [],
                                hp: card.hp ?? null,
                                stage: card.stage ?? null,
                                illustrator: card.illustrator ?? null,
                                description: card.description ?? null,
                                evolveFrom: card.evolveFrom ?? null,
                                regulationMark: card.regulationMark ?? null,
                                dexId: card.dexId ?? [],
                                variants: card.variants ?? null,
                                attacks: card.attacks ?? null,
                                weaknesses: card.weaknesses ?? null,
                                retreat: card.retreat ?? null,
                                category: card.category ?? null,
                                legal: card.legal ?? null,
                                setId: setDetail.id,
                            },
                            update: {
                                name: card.name ?? "",
                                image: card.image ?? null,
                                rarity: card.rarity ?? null,
                                types: card.types ?? [],
                                hp: card.hp ?? null,
                                stage: card.stage ?? null,
                                illustrator: card.illustrator ?? null,
                                description: card.description ?? null,
                                evolveFrom: card.evolveFrom ?? null,
                                regulationMark: card.regulationMark ?? null,
                                dexId: card.dexId ?? [],
                                variants: card.variants ?? null,
                                attacks: card.attacks ?? null,
                                weaknesses: card.weaknesses ?? null,
                                retreat: card.retreat ?? null,
                                category: card.category ?? null,
                                legal: card.legal ?? null,
                            },
                        });
                    }),
                );

                process.stdout.write(
                    `\r    Cards: ${Math.min(i + BATCH, cards.length)}/${cards.length}`,
                );

                // Small delay between card batches
                if (i + BATCH < cards.length) {
                    await new Promise((r) => setTimeout(r, 300));
                }
            }

            console.log(); // newline after progress

            // Delay between sets
            await new Promise((r) => setTimeout(r, 500));
        }
    }
}

async function main() {
    console.log("Starting TCGdex seed...");
    console.log("This will take a while. Fetching all sets and cards.\n");

    try {
        await seedSeries();
        console.log("\nSeed complete!");
    } catch (err) {
        console.error("Seed failed:", err);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
