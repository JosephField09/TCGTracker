"use client";

import { useState, useTransition } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { getPriceHistory } from "@/app/actions/prices";
import type { PriceHistoryPoint } from "@/app/actions/prices";
import { format, parseISO } from "date-fns";

interface Props {
    cardId: string;
    initialData: PriceHistoryPoint[];
    snapshotCount: number;
}

const TABS = [
    { label: "30d", days: 30 as const, minSnapshots: 2 },
    { label: "90d", days: 90 as const, minSnapshots: 7 },
    { label: "1yr", days: 365 as const, minSnapshots: 30 },
];

export default function PriceHistoryChart({
    cardId,
    initialData,
    snapshotCount,
}: Props) {
    const [activeTab, setActiveTab] = useState<30 | 90 | 365>(30);
    const [data, setData] = useState(initialData);
    const [isPending, startTransition] = useTransition();

    function handleTabChange(days: 30 | 90 | 365) {
        if (days === activeTab) return;
        setActiveTab(days);
        startTransition(async () => {
            const newData = await getPriceHistory(cardId, days);
            setData(newData);
        });
    }

    const currency = data[0]?.currency === "EUR" ? "€" : "$";

    // Format date for x-axis
    function formatDate(dateStr: string) {
        try {
            return format(parseISO(dateStr), "d MMM");
        } catch {
            return dateStr;
        }
    }

    // Price change vs first data point
    const firstPrice = data[0]?.price;
    const lastPrice = data[data.length - 1]?.price;
    const priceChange = firstPrice && lastPrice ? lastPrice - firstPrice : null;
    const priceChangePct =
        firstPrice && priceChange !== null
            ? (priceChange / firstPrice) * 100
            : null;

    const hasData = data.length >= 2;

    return (
        <div
            className="bg-white border border-wisteria rounded-2xl p-6"
            id="price-history"
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="font-display text-lg font-medium text-dusk">
                        Price history
                    </h2>
                    {hasData && priceChangePct !== null && (
                        <p
                            className={`text-xs mt-0.5 ${
                                priceChange! >= 0
                                    ? "text-price-up"
                                    : "text-price-down"
                            }`}
                        >
                            {priceChange! >= 0 ? "+" : ""}
                            {currency}
                            {Math.abs(priceChange!).toFixed(2)} (
                            {priceChangePct >= 0 ? "+" : ""}
                            {priceChangePct.toFixed(1)}%) in selected period
                        </p>
                    )}
                </div>

                {/* Tab buttons */}
                <div className="flex gap-1">
                    {TABS.map((tab) => {
                        const hasEnoughData = snapshotCount >= tab.minSnapshots;
                        const isActive = activeTab === tab.days;
                        return (
                            <button
                                key={tab.label}
                                onClick={() =>
                                    hasEnoughData && handleTabChange(tab.days)
                                }
                                disabled={!hasEnoughData || isPending}
                                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                                    isActive && hasEnoughData
                                        ? "bg-iris text-violet font-medium"
                                        : hasEnoughData
                                          ? "text-heather hover:text-violet"
                                          : "text-lilac cursor-not-allowed opacity-50"
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Chart or empty state */}
            {!hasData ? (
                <div className="h-40 flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-heather">No price history yet</p>
                    <p className="text-xs text-lilac mt-1">
                        Price snapshots are taken daily — check back tomorrow
                    </p>
                </div>
            ) : (
                <div
                    className={isPending ? "opacity-50 transition-opacity" : ""}
                >
                    <ResponsiveContainer width="100%" height={160}>
                        <BarChart
                            data={data}
                            margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#DDD6F0"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                tick={{ fontSize: 10, fill: "#A89EC4" }}
                                axisLine={false}
                                tickLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: "#A89EC4" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) =>
                                    `${currency}${v.toFixed(2)}`
                                }
                                width={65}
                            />
                            <Tooltip
                                formatter={(value) => [
                                    `${currency}${Number(value ?? 0).toFixed(2)}`,
                                    "Price",
                                ]}
                                labelFormatter={(label) => formatDate(String(label))}
                                contentStyle={{
                                    background: "#fff",
                                    border: "0.5px solid #DDD6F0",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    color: "#1E1A2E",
                                }}
                                cursor={{ fill: "#EDE8F8" }}
                            />
                            <Bar
                                dataKey="price"
                                fill="#6C4FBF"
                                radius={[3, 3, 0, 0]}
                                maxBarSize={24}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
