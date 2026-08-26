"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import {
    deleteAlert,
    resetAlert,
    updateAlertTarget,
} from "@/app/actions/alerts";
import type { AlertWithPrice } from "@/app/actions/alerts";
import { FaBell } from "react-icons/fa6";

interface Props {
    alerts: AlertWithPrice[];
}

export default function AlertsClient({ alerts }: Props) {
    const [isPending, startTransition] = useTransition();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    const active = alerts.filter((a) => !a.triggered);
    const triggered = alerts.filter((a) => a.triggered);

    function handleDelete(id: string) {
        startTransition(async () => {
            await deleteAlert(id);
        });
    }

    function handleReset(id: string) {
        startTransition(async () => {
            await resetAlert(id);
        });
    }

    function handleUpdate(id: string) {
        if (!editValue || isNaN(parseFloat(editValue))) return;
        startTransition(async () => {
            await updateAlertTarget(id, parseFloat(editValue));
            setEditingId(null);
        });
    }

    function getDistance(alert: AlertWithPrice) {
        if (!alert.currentPrice) return null;
        const diff = alert.targetPrice - alert.currentPrice;
        const pct = Math.abs((diff / alert.currentPrice) * 100);
        const symbol = alert.currency === "EUR" ? "€" : "$";
        const isClose = pct < 10;
        return { diff, pct, symbol, isClose };
    }

    function getProgressWidth(alert: AlertWithPrice) {
        if (!alert.currentPrice) return 0;
        if (alert.direction === "ABOVE") {
            return Math.min(
                100,
                (alert.currentPrice / alert.targetPrice) * 100,
            );
        } else {
            const max = alert.currentPrice * 1.5;
            return Math.min(
                100,
                ((max - alert.currentPrice) / (max - alert.targetPrice)) * 100,
            );
        }
    }

    return (
        <div className="space-y-5 w-8/12 mx-auto">
            <h1 className="font-display text-3xl font-bold text-midnight">
                Price Alerts
            </h1>

            {alerts.length === 0 && (
                <div className="bg-white border border-wisteria rounded-2xl p-12 text-center">
                    <p className="flex justify-center text-2xl mb-2 text-gold">
                        <FaBell />
                    </p>
                    <p className="text-sm font-medium text-midnight">
                        No alerts set
                    </p>
                    <p className="text-xs text-lilac mt-1">
                        Visit a card page to set a price alert
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-0 md:divide-x md:divide-wisteria">
                {/* Active alerts */}
                {active.length > 0 && (
                    <div className="min-w-0 md:pr-6">
                        <h2 className="font-display text-lg font-medium text-dusk mb-3">
                            Active ({active.length})
                        </h2>
                        <div className="space-y-3">
                            {active.map((alert) => {
                                const dist = getDistance(alert);
                                const progress = getProgressWidth(alert);
                                const symbol = alert.currency === "EUR" ? "€" : "$";

                                return (
                                    <div
                                        key={alert.id}
                                        className="bg-white border border-wisteria rounded-2xl p-4 min-w-full"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Card image */}
                                            <Link href={`/cards/${alert.cardId}`}>
                                                <div className="w-10 h-14 bg-lavender rounded-lg overflow-hidden shrink-0">
                                                    {alert.imageUrl && (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={`${alert.imageUrl}/low.png`}
                                                            alt={alert.cardName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                            </Link>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <Link
                                                            href={`/cards/${alert.cardId}`}
                                                            className="text-sm font-medium text-midnight hover:text-violet transition-colors no-underline"
                                                        >
                                                            {alert.cardName}
                                                        </Link>
                                                        <p className="text-xs text-lilac mt-0.5">
                                                            {alert.setName}
                                                        </p>
                                                    </div>

                                                    {/* Target */}
                                                    <div className="text-right shrink-0">
                                                        {editingId === alert.id ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-xs text-lilac">
                                                                    {symbol}
                                                                </span>
                                                                <input
                                                                    autoFocus
                                                                    type="number"
                                                                    value={
                                                                        editValue
                                                                    }
                                                                    onChange={(e) =>
                                                                        setEditValue(
                                                                            e.target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    onKeyDown={(
                                                                        e,
                                                                    ) => {
                                                                        if (
                                                                            e.key ===
                                                                            "Enter"
                                                                        )
                                                                            handleUpdate(
                                                                                alert.id,
                                                                            );
                                                                        if (
                                                                            e.key ===
                                                                            "Escape"
                                                                        )
                                                                            setEditingId(
                                                                                null,
                                                                            );
                                                                    }}
                                                                    className="w-20 text-sm border border-violet rounded px-2 py-0.5 outline-none text-midnight"
                                                                />
                                                                <button
                                                                    onClick={() =>
                                                                        handleUpdate(
                                                                            alert.id,
                                                                        )
                                                                    }
                                                                    className="text-xs text-violet font-medium"
                                                                >
                                                                    Save
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setEditingId(
                                                                        alert.id,
                                                                    );
                                                                    setEditValue(
                                                                        alert.targetPrice.toFixed(
                                                                            2,
                                                                        ),
                                                                    );
                                                                }}
                                                                className="text-right hover:opacity-70 transition-opacity"
                                                            >
                                                                <p className="text-xs text-lilac">
                                                                    {alert.direction ===
                                                                    "ABOVE"
                                                                        ? "↑ Above"
                                                                        : "↓ Below"}
                                                                </p>
                                                                <p className="text-sm font-medium text-midnight">
                                                                    {symbol}
                                                                    {alert.targetPrice.toFixed(
                                                                        2,
                                                                    )}
                                                                </p>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Prices row */}
                                                <div className="flex items-center gap-4 mt-2">
                                                    <div>
                                                        <p className="text-[10px] text-lilac">
                                                            Current
                                                        </p>
                                                        <p className="text-sm font-medium text-midnight">
                                                            {alert.currentPrice !==
                                                            null
                                                                ? `${symbol}${alert.currentPrice.toFixed(2)}`
                                                                : "-.--"}
                                                        </p>
                                                    </div>
                                                    {dist && (
                                                        <div>
                                                            <p className="text-[10px] text-lilac">
                                                                Distance
                                                            </p>
                                                            <p
                                                                className={`text-sm font-medium ${
                                                                    dist.isClose
                                                                        ? "text-gold"
                                                                        : "text-heather"
                                                                }`}
                                                            >
                                                                {symbol}
                                                                {Math.abs(
                                                                    dist.diff,
                                                                ).toFixed(2)}{" "}
                                                                away
                                                                <span className="text-[10px] ml-1 opacity-70">
                                                                    (
                                                                    {dist.pct.toFixed(
                                                                        1,
                                                                    )}
                                                                    %)
                                                                </span>
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Progress bar */}
                                                <div className="mt-2.5">
                                                    <div className="h-1.5 bg-iris rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-violet rounded-full transition-all"
                                                            style={{
                                                                width: `${progress}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-3 mt-2.5">
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(alert.id)
                                                        }
                                                        disabled={isPending}
                                                        className="text-xs text-price-down hover:text-[#C0392B] hover:cursor-pointer transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Triggered alerts */}
                {triggered.length > 0 && (
                    <div className="min-w-0 md:pl-6">
                        <h2 className="font-display text-lg font-medium text-dusk mb-3">
                            Triggered ({triggered.length})
                        </h2>
                        <div className="space-y-3">
                            {triggered.map((alert) => {
                                const symbol = alert.currency === "EUR" ? "€" : "$";
                                return (
                                    <div
                                        key={alert.id}
                                        className="bg-white border border-price-up rounded-2xl p-4 min-w-full opacity-80"
                                    >
                                        <div className="flex items-start gap-4">
                                            <Link href={`/cards/${alert.cardId}`}>
                                                <div className="w-10 h-14 bg-lavender rounded-lg overflow-hidden shrink-0">
                                                    {alert.imageUrl && (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={`${alert.imageUrl}/low.png`}
                                                            alt={alert.cardName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <Link
                                                            href={`/cards/${alert.cardId}`}
                                                            className="text-sm font-medium text-midnight hover:text-violet transition-colors no-underline"
                                                        >
                                                            {alert.cardName}
                                                        </Link>
                                                        <p className="text-xs text-lilac mt-0.5">
                                                            {alert.setName}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs bg-price-up-tint text-[#1A6B4A] px-2 py-0.5 rounded-full font-medium shrink-0">
                                                        ✓ Triggered
                                                    </span>
                                                </div>
                                                <p className="text-xs text-lilac mt-1.5">
                                                    {alert.direction === "ABOVE"
                                                        ? "Rose above"
                                                        : "Fell below"}{" "}
                                                    {symbol}
                                                    {alert.targetPrice.toFixed(2)}
                                                    {alert.triggeredAt && (
                                                        <>
                                                            {" "}
                                                            ·{" "}
                                                            {formatDistanceToNowStrict(
                                                                new Date(
                                                                    alert.triggeredAt,
                                                                ),
                                                                { addSuffix: true },
                                                            )}
                                                        </>
                                                    )}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2.5">
                                                    <button
                                                        onClick={() =>
                                                            handleReset(alert.id)
                                                        }
                                                        disabled={isPending}
                                                        className="text-xs text-violet hover:text-amethyst hover:cursor-pointer font-medium transition-colors"
                                                    >
                                                        Update alert
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(alert.id)
                                                        }
                                                        disabled={isPending}
                                                        className="text-xs text-price-down hover:text-[#C0392B] hover:cursor-pointer transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
