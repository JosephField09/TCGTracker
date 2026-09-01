import Skeleton from "@/components/ui/Skeleton";

function AlertItemSkeleton() {
    return (
        <div className="bg-white border border-wisteria rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-32" />
                </div>
                <div className="space-y-2 text-right">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-1 w-full rounded-full" />
                <div className="flex justify-between text-xs">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-12" />
                </div>
            </div>
            <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
        </div>
    );
}

export default function AlertsLoading() {
    return (
        <div className="space-y-5 w-8/12 mx-auto">
            {/* Page header */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Tabs/Filter */}
            <div className="flex gap-4 border-b border-wisteria">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
            </div>

            {/* Active alerts section */}
            <div className="space-y-3">
                <Skeleton className="h-5 w-32" />
                {Array.from({ length: 4 }).map((_, i) => (
                    <AlertItemSkeleton key={i} />
                ))}
            </div>

            {/* Triggered alerts section */}
            <div className="space-y-3">
                <Skeleton className="h-5 w-32" />
                {Array.from({ length: 2 }).map((_, i) => (
                    <AlertItemSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
