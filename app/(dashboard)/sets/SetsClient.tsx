"use client";

import { useState, useMemo } from "react";
import { TcgSerie } from "@/lib/tcgdex";
import Link from "next/link";

interface Props {
    series: TcgSerie[];
}

interface SetImageProps {
    src: string;
    alt: string;
    className: string;
    fallback: string;
}

function SetImage({ src, alt, className, fallback }: SetImageProps) {
    const [hasError, setHasError] = useState(false);
    const imageUrl = /\.png(?:$|\?)/i.test(src) ? src : `${src}.png`;

    if (hasError) {
        return <span className="text-xs text-heather font-semibold">{fallback}</span>;
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={imageUrl}
            alt={alt}
            className={className}
            onError={() => setHasError(true)}
        />
    );
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
        <div className="mx-auto w-11/12 min-w-0 space-y-5 lg:w-8/12">
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
                    className="w-full bg-white border border-wisteria rounded-lg px-4 py-2 text-sm text-midnight placeholder:text-lilac focus:outline-none focus:border-violet lg:w-64"
                />
            </div>
            <hr className="border-wisteria" />
            <div className="flex min-w-0 items-center gap-3">
                <div className="grid min-w-0 auto-cols-48 grid-flow-col grid-rows-2 gap-2 overflow-x-auto pb-1 lg:flex lg:flex-wrap lg:overflow-visible lg:pb-0">
                    <button
                        onClick={() => setActiveSerie(null)}
                            className={`inline-flex h-8 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-colors lg:h-auto lg:w-auto ${
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
                            className={`inline-flex h-8 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-colors lg:h-auto lg:w-auto ${
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
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                        {serie.sets.map((set) => (
                            <Link
                                key={set.id}
                                href={`/sets/${set.id}`}
                                className="min-w-0 bg-white border border-wisteria rounded-lg p-3 lg:p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-shadow"
                            >
                                {/* Set logo */}
                                <div className="w-full h-22 flex items-center justify-center bg-iris rounded-xl">
                                    {set.logo ? (
                                        <SetImage
                                            src={set.logo}
                                            alt={set.name}
                                            className="max-w-full max-h-full p-2"
                                            fallback={set.name}
                                        />
                                    ) : (
                                        <span className="text-xs text-gray-500 text-center p-1">{set.name}</span>
                                    )}
                                </div>
                                {/* Set name */}
                                <div className="flex w-full min-w-0 flex-row items-center justify-left gap-2">
                                    {set.symbol ? (
                                        <SetImage
                                            src={set.symbol}
                                            alt={`${set.name} symbol`}
                                            className="max-h-7 max-w-7 shrink-0"
                                            fallback={set.id}
                                        />
                                    ) : (
                                        <span className="text-xs text-heather font-semibold">{set.id}</span>
                                    )}
                                    <p className="min-w-0 text-sm font-medium text-midnight truncate group-hover:text-violet transition-colors">
                                        {set.name}
                                    </p>
                                </div>
                                <p className="text-[10px] text-lilac mt-0.5">
                                    {set.cardCount.official} cards
                                    {set.releaseDate && (
                                        <span className="ml-1">
                                            · {new Date(set.releaseDate).toLocaleDateString("en-US", {
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    )}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}