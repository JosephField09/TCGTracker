import Skeleton from "@/components/ui/Skeleton";

function StatCardSkeleton() {
    return (
        <div className="bg-white border border-wisteria rounded-2xl p-4 space-y-2 text-center">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-3 w-2/3 mx-auto" />
        </div>
    );
}

function CollectionItemSkeleton() {
    return (
        <div className="bg-white border border-wisteria rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-start gap-2">
                <Skeleton className="h-5 w-32" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-6 rounded-sm" />
                    <Skeleton className="h-6 w-6 rounded-sm" />
                    <Skeleton className="h-6 w-6 rounded-sm" />
                </div>
            </div>
            <div className="space-y-1">
                <div className="flex justify-between text-xs">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
        </div>
    );
}

function PokemonRankItemSkeleton() {
    return (
        <div className="py-2 border-b border-wisteria last:border-b-0 flex justify-between items-center">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-12" />
        </div>
    );
}

export default function ProfileLoading() {
    return (
        <div className="space-y-5 w-8/12 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
                {/* Left column */}
                <div className="space-y-6">
                    {/* User header */}
                    <div className="bg-white border border-wisteria rounded-2xl p-6 space-y-4">
                        <div className="flex gap-4 items-start">
                            <Skeleton className="w-16 h-16 rounded-full shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </div>
                    </div>

                    {/* Stat row */}
                    <div className="grid grid-cols-4 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <StatCardSkeleton key={i} />
                        ))}
                    </div>

                    {/* Collections section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-10 w-24 rounded-lg" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <CollectionItemSkeleton key={i} />
                            ))}
                        </div>
                    </div>

                    {/* Rarity breakdown chart */}
                    <div className="bg-white border border-wisteria rounded-2xl p-6 space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="w-full h-64" />
                    </div>
                </div>

                {/* Right column - Sidebar */}
                <div className="space-y-4">
                    {/* Most collected pokemon */}
                    <div className="bg-white border border-wisteria rounded-2xl p-4 space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <PokemonRankItemSkeleton key={i} />
                            ))}
                        </div>
                    </div>

                    {/* Quick stats box */}
                    <div className="bg-white border border-wisteria rounded-2xl p-4 space-y-3">
                        <Skeleton className="h-5 w-24" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>

                    {/* Export button */}
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
}
