"use client";

import { useState, useMemo } from "react";
import { TcgSerie } from "@/lib/tcgdex";
import { BsSearch } from "react-icons/bs";
import Link from "next/link";

interface Props {
    series: TcgSerie[];
}

export default function SetsClient({ series }: Props) {
    const [search, setSearch] = useState("");
    const [activeSerie, setActiveSerie] = useState<string | null>(null);
    
    const filtered = useMemo(() => {
        return series
            .map((serie) => ({
                ...serie,
                sets: serie.sets.filter((set) =>
                    set.name.toLowerCase().includes(search.toLowerCase())
            ),
        }))
        .filter((serie) => {
            if (activeSerie && serie.id !== activeSerie) {
                return false;
            }
            return serie.sets.length > 0;
        });
    }, [series, search, activeSerie]);

    return (
        <div className="space-y-5 w-8/12 mx-auto">
            {/* Page Header */}
            <div>
                <h1 className="font-display text-3xl text-midnight font-bold">
                    Browse Sets
                </h1>
                <p className="text-heather font-medium text-x1">
                    {series.reduce((acc, s) => acc + s.sets.length, 0)} sets across {series.length} generations
                </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-wrap gap-3 items-center">
                <input
                    type="text"
                    placeholder="Search sets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white border border-wisteria rounded-lg px-4 py-2 text-sm text-midnight placeholder:text-lilac focus:outline-none focus:border-violet w-64"
                />
            </div>
            <hr className="border-wisteria" />
            <div className="flex flex-wrap gap-3 items-center">
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setActiveSerie(null)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                            activeSerie === null
                                ? "bg-violet text-white border-violet"
                                : "bg-iris text-heather border-wisteria hover:bg-violet hover:text-white hover:border-violet"
                        }`}
                    >
                        All Series
                    </button>
                    {series.map((serie) => (
                        <button
                            key={serie.id}
                            onClick={() => setActiveSerie(serie.id === activeSerie ? null : serie.id)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                                activeSerie === serie.id
                                    ? "bg-violet text-white border-violet"
                                    : "bg-iris text-heather border-wisteria hover:bg-violet hover:text-white hover:border-violet"
                            }`}
                        >
                            {serie.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Series groups */}
            {filtered.map((serie) => (
                <div key={serie.id}>
                    {/* Era header */}
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="font-display text-xl text-midnight font-medium">{serie.name}</h2>
                        <span className="text-sm bg-iris text-violet px-2.5 py-0.5 rounded-full font-semibold">
                            {serie.sets.length} sets
                        </span>
                        <div className="flex-1 h-px bg-wisteria" />
                    </div>

                    {/* Sets grid */}
                    <div className="grid grid-cols-4 gap-4">
                        {serie.sets.map((set) => (
                            <Link
                                key={set.id}
                                href={`/sets/${set.id}`}
                                className="bg-white border border-wisteria rounded-lg p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-shadow"
                            >
                                {/* Set logo */}
                                <div className="w-11/12 h-22 flex items-center justify-center bg-iris rounded-xl">
                                    {set.logo ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={`${set.logo}.png`} alt={set.name} className="max-w-full max-h-full p-2" />
                                    ) : (
                                        <span className="text-xs text-gray-500">{set.name}</span>
                                    )}
                                </div>
                                {/* Set name */}
                                <div className="flex flex-row items-center justify-left gap-2 w-11/12">
                                    {set.symbol ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={`${set.symbol}.png`} alt={set.name} className="max-w-7 " />
                                    ) : (
                                        <span className="text-xs text-heather font-semibold">{set.id}</span>
                                    )}
                                    <p className="text-sm font-medium text-midnight truncate group-hover:text-violet transition-colors">
                                        {set.name}
                                    </p>
                                </div>
                                <p className="text-[10px] text-lilac mt-0.5">
                                    {set.cardCount.official} cards
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}