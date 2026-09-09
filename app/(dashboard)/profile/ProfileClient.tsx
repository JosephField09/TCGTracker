"use client";

import { useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { FaBell } from "react-icons/fa6";
import {
    createCollection,
    renameCollection,
    deleteCollection,
    getCollectionCsvData,
} from "@/app/actions/profile";
import type { ProfileData } from "@/app/actions/profile";

export default function ProfileClient({
    username,
    memberSince,
    totalCards,
    estimatedValue,
    setsCollected,
    setsCompleted,
    collections,
    rarityBreakdown,
    mostCollectedPokemon,
    triggeredAlertCount,
}: ProfileData) {
    const { user } = useUser();
    const [isPending, startTransition] = useTransition();
    const [isCreating, setIsCreating] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState("");
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState("");

    const avatarUrl = user?.imageUrl;
    const initials = username?.charAt(0).toUpperCase() ?? "?";

    function handleCreateCollection() {
        if (!newCollectionName.trim()) return;
        startTransition(async () => {
            await createCollection(newCollectionName.trim());
            setNewCollectionName("");
            setIsCreating(false);
        });
    }

    function handleRename(id: string) {
        if (!renameValue.trim()) return;
        startTransition(async () => {
            await renameCollection(id, renameValue.trim());
            setRenamingId(null);
        });
    }

    function handleDelete(id: string) {
        if (
            !confirm(
                "Delete this collection? Cards inside will also be deleted.",
            )
        )
            return;
        startTransition(async () => {
            await deleteCollection(id);
        });
    }

    async function handleExportCsv() {
        const data = await getCollectionCsvData();
        const headers = [
            "Card Name",
            "Set",
            "Card ID",
            "Variant",
            "Condition",
            "Quantity",
            "Market Value",
            "Notes",
        ];
        const rows = data.map((row) =>
            [
                row.cardName,
                row.set,
                row.cardId,
                row.variant,
                row.condition,
                row.quantity,
                row.marketValue,
                row.notes,
            ]
                .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                .join(","),
        );
        const csv = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tcgtracker-collection-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="mx-auto w-11/12 min-w-0 space-y-5 lg:w-8/12">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
                {/* Left column */}
                <div className="order-2 space-y-6 lg:order-1 lg:row-span-2">
                    {/* Stat row */}
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {[
                            {
                                label: "Total cards",
                                value: totalCards.toLocaleString(),
                            },
                            {
                                label: "Est. value",
                                value: `€${estimatedValue.toFixed(2)}`,
                            },
                            { label: "Sets collected", value: setsCollected },
                            {
                                label: "Sets completed",
                                value: setsCompleted,
                                highlight: true,
                            },
                        ].map(({ label, value, highlight }) => (
                            <div
                                key={label}
                                className="min-w-0 bg-white border border-wisteria rounded-2xl p-3 text-center md:p-4"
                            >
                                <p
                                    className={`truncate text-2xl font-medium md:text-4xl ${highlight ? "text-price-up" : "text-midnight"}`}
                                >
                                    {value}
                                </p>
                                <p className="text-xs text-heather mt-1 md:text-base">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Collection breakdown donut */}
                    <div className="min-w-0 bg-white border border-wisteria rounded-2xl p-4 md:p-6">
                        <h2 className="text-2xl font-bold text-midnight mb-4">
                            Collection Breakdown
                        </h2>
                        {rarityBreakdown.length === 0 ? (
                            <p className="text-sm text-lilac text-center py-8">
                                No cards in collection yet
                            </p>
                        ) : (
                            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
                                <div className="relative h-40 w-40 shrink-0 sm:h-48 sm:w-48">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={rarityBreakdown}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={80}
                                                dataKey="count"
                                                nameKey="rarity"
                                                strokeWidth={2}
                                                stroke="#F4F1FB"
                                            >
                                                {rarityBreakdown.map(
                                                    (entry, i) => (
                                                        <Cell
                                                            key={i}
                                                            fill={entry.colour}
                                                        />
                                                    ),
                                                )}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value, name) => [
                                                    `${value} cards`,
                                                    name,
                                                ]}
                                                contentStyle={{
                                                    background: "#fff",
                                                    border: "0.5px solid #DDD6F0",
                                                    borderRadius: "8px",
                                                    fontSize: "16px",
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* Centre label */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <p className="text-3xl font-medium text-midnight">
                                            {totalCards}
                                        </p>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="grid w-full grid-cols-2 gap-2 sm:flex-1">
                                    {rarityBreakdown.map((entry) => (
                                        <div
                                            key={entry.rarity}
                                            className="flex items-center gap-2"
                                        >
                                            <span
                                                className="w-3 h-3 rounded-full shrink-0"
                                                style={{
                                                    background: entry.colour,
                                                }}
                                            />
                                            <span className="min-w-0 truncate text-sm text-midnight md:text-base">
                                                {entry.rarity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* My Collections */}
                    <div className="min-w-0 bg-white border border-wisteria rounded-2xl p-4 md:p-6">
                        <h2 className="font-display text-xl font-medium text-dusk mb-4">
                            My Collections
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {collections.map((col) => (
                                <div
                                    key={col.id}
                                    className="border border-wisteria rounded-xl p-4 flex items-start gap-3 group relative"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-iris flex items-center justify-center text-lg shrink-0">
                                        {col.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {renamingId === col.id ? (
                                            <div className="flex gap-1">
                                                <input
                                                    autoFocus
                                                    value={renameValue}
                                                    onChange={(e) =>
                                                        setRenameValue(
                                                            e.target.value,
                                                        )
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter")
                                                            handleRename(
                                                                col.id,
                                                            );
                                                        if (e.key === "Escape")
                                                            setRenamingId(null);
                                                    }}
                                                    className="text-sm border border-violet rounded px-2 py-0.5 outline-none flex-1 min-w-0"
                                                />
                                                <button
                                                    onClick={() =>
                                                        handleRename(col.id)
                                                    }
                                                    className="text-xs text-violet font-medium"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-sm font-medium text-midnight truncate">
                                                {col.name}
                                            </p>
                                        )}
                                        <p className="text-xs text-lilac mt-0.5">
                                            {col.cardCount} cards ·{" "}
                                            {col.setCount} sets
                                        </p>
                                        <p className="text-xs font-medium text-midnight mt-1">
                                            €{col.estimatedValue.toFixed(2)}
                                            <span className="text-lilac font-normal ml-1">
                                                est. value
                                            </span>
                                        </p>
                                    </div>
                                    {/* Actions */}
                                    <div className="flex flex-col gap-1 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
                                        <button
                                            onClick={() => {
                                                setRenamingId(col.id);
                                                setRenameValue(col.name);
                                            }}
                                            className="text-[10px] text-heather hover:text-violet transition-colors"
                                        >
                                            Rename
                                        </button>
                                        {collections.length > 1 && (
                                            <button
                                                onClick={() =>
                                                    handleDelete(col.id)
                                                }
                                                className="text-[10px] text-price-down hover:text-[#C0392B] transition-colors"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Create new */}
                            {isCreating ? (
                                <div className="border border-violet rounded-xl p-4">
                                    <input
                                        autoFocus
                                        placeholder="Collection name..."
                                        value={newCollectionName}
                                        onChange={(e) =>
                                            setNewCollectionName(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                                handleCreateCollection();
                                            if (e.key === "Escape")
                                                setIsCreating(false);
                                        }}
                                        className="text-sm w-full outline-none text-midnight placeholder:text-lilac mb-2"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleCreateCollection}
                                            disabled={isPending}
                                            className="text-xs bg-violet text-white px-3 py-1 rounded-lg disabled:opacity-50"
                                        >
                                            Create
                                        </button>
                                        <button
                                            onClick={() => setIsCreating(false)}
                                            className="text-xs text-heather hover:text-midnight"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="border border-dashed border-wisteria rounded-xl p-4 flex items-center justify-center gap-2 text-sm text-heather hover:border-violet hover:text-violet transition-colors"
                                >
                                    <span className="text-lg">+</span>
                                    Create a new collection
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile card */}
                <div className="order-1 bg-white border border-wisteria rounded-2xl p-6 flex flex-col items-center text-center lg:order-2 lg:col-start-2 lg:row-start-1">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full bg-iris flex items-center justify-center overflow-hidden mb-4">
                            {avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={avatarUrl}
                                    alt={username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-3xl font-medium text-violet">
                                    {initials}
                                </span>
                            )}
                        </div>

                        <p className="text-xl font-medium text-midnight">
                            {username}
                        </p>
                        <p className="text-sm text-violet mt-1">
                            Member since{" "}
                            {format(new Date(memberSince), "MMM yyyy")}
                        </p>

                        {/* Most collected */}
                        {mostCollectedPokemon && (
                            <div className="mt-4 pt-4 border-t border-wisteria w-full flex flex-col items-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={`https://img.pokemondb.net/sprites/home/normal/${mostCollectedPokemon}.png`}
                                    alt={mostCollectedPokemon}
                                    className="w-20 h-20 object-contain"
                                    onError={(e) => {
                                        (
                                            e.target as HTMLImageElement
                                        ).style.display = "none";
                                    }}
                                />
                                <p className="text-xs text-lilac mt-2">
                                    Most Collected
                                </p>
                            </div>
                        )}
                </div>

                {/* Actions */}
                <div className="order-3 space-y-2 lg:order-3 lg:col-start-2 lg:row-start-2">
                        <Link
                            href="/alerts"
                            className="relative w-full flex items-center justify-center gap-2 bg-white border border-wisteria rounded-xl py-3 text-sm text-midnight hover:border-violet hover:text-violet transition-colors no-underline"
                        >
                            <FaBell />
                            Alerts
                            {triggeredAlertCount > 0 && (
                                <span className="absolute right-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-price-down px-1 text-[10px] font-bold leading-none text-white">
                                    {triggeredAlertCount > 99 ? "99+" : triggeredAlertCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={handleExportCsv}
                            className="w-full flex items-center justify-center gap-2 bg-white border border-wisteria rounded-xl py-3 text-sm text-midnight hover:border-violet hover:text-violet transition-colors"
                        >
                            <span>↓</span> Export CSV
                        </button>
                        <button
                            disabled
                            className="w-full flex items-center justify-center gap-2 bg-white border border-wisteria rounded-xl py-3 text-sm text-lilac cursor-not-allowed"
                        >
                            <span>↑</span> Import CSV
                            <span className="text-[10px] bg-lavender px-1.5 py-0.5 rounded text-heather">
                                Coming soon
                            </span>
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 bg-violet rounded-xl py-3 text-sm text-white hover:bg-amethyst transition-colors">
                            ⚙ Settings
                        </button>
                </div>
            </div>
        </div>
    );
}
