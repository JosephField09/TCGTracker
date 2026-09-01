import Skeleton from "@/components/ui/Skeleton";

function StatCardSkeleton() {
    return (
        <div className="bg-white border border-wisteria rounded-2xl p-5 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-28" />
        </div>
    );
}

function TopCardItemSkeleton() {
    return (
        <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-12 rounded-sm shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2.5 w-2/3" />
            </div>
            <div className="text-right shrink-0 space-y-2">
                <Skeleton className="h-3 w-16 ml-auto" />
                <Skeleton className="h-2.5 w-12 ml-auto" />
            </div>
        </div>
    );
}

function SetProgressSkeleton() {
    return (
        <div className="bg-white border border-wisteria rounded-2xl p-4 space-y-3">
            <Skeleton className="h-4 w-40" />
            <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
        </div>
    );
}

function RecentActivitySkeleton() {
    return (
        <div className="py-3 border-b border-wisteria last:border-b-0 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-1/2" />
        </div>
    );
}

export default function DashboardLoading() {
    return (
        <div className="space-y-5 w-8/12 mx-auto">
            {/* Page title */}
            <Skeleton className="h-8 w-40" />

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>

            {/* Chart + Top 5 */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
                {/* Chart skeleton */}
                <div className="bg-white border border-wisteria rounded-2xl p-6 space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-64 w-full" />
                </div>

                {/* Top 5 cards */}
                <div className="bg-white border border-wisteria rounded-2xl p-6 space-y-4">
                    <Skeleton className="h-6 w-24" />
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TopCardItemSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Set progress */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <SetProgressSkeleton key={i} />
                    ))}
                </div>
            </div>

            {/* Recent activity */}
            <div className="bg-white border border-wisteria rounded-2xl p-6 space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="divide-y divide-wisteria">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <RecentActivitySkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
