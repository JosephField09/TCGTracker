import Skeleton from "@/components/ui/Skeleton";

function SetCardSkeleton() {
    return (
        <div className="bg-white border border-wisteria rounded-lg p-4 flex flex-col items-center gap-2">
            {/* Set logo area */}
            <Skeleton className="w-11/12 h-22 rounded-xl" />
            {/* Set name area */}
            <div className="w-11/12 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3 mx-auto" />
            </div>
        </div>
    );
}

function SeriesGroupSkeleton() {
    return (
        <div className="space-y-4">
            {/* Series header */}
            <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <div className="flex-1 h-px bg-wisteria" />
            </div>
            {/* Sets grid - 4 columns like the actual client */}
            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SetCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

export default function SetsLoading() {
    return (
        <div className="space-y-5 w-8/12 mx-auto">
            {/* Page header */}
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-80" />
            </div>

            {/* Search input */}
            <div className="flex flex-wrap gap-3 items-center">
                <Skeleton className="h-9 w-64 rounded-lg" />
            </div>

            {/* Divider */}
            <div className="border-b border-wisteria" />

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-3 items-center">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
            </div>

            {/* Series groups */}
            {Array.from({ length: 3 }).map((_, i) => (
                <SeriesGroupSkeleton key={i} />
            ))}
        </div>
    );
}
