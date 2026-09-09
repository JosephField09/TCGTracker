import Skeleton from "@/components/ui/Skeleton";
import { CollectionProvider } from "@/context/CollectionContext";

function CardGridItemSkeleton() {
    return (
        <div className="space-y-2">
            <Skeleton className="w-full aspect-2/3 rounded-lg" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
        </div>
    );
}

export default function SetLoading() {
    return (
        <CollectionProvider initialMap={{}}>
            <div className="mx-auto w-11/12 min-w-0 space-y-5 lg:w-8/12">
            {/* Breadcrumb */}
            <div className="flex gap-2 items-center text-sm">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-2" />
                <Skeleton className="h-4 w-40" />
            </div>

            {/* Set Header */}
            <div className="bg-white border border-wisteria rounded-2xl p-4 md:p-6 space-y-4">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-1 w-full" />

                {/* Set stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-1">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Skeleton className="h-9 w-full rounded-lg sm:w-48" />
                <div className="grid grid-cols-3 gap-2 sm:flex">
                    <Skeleton className="h-9 w-full rounded-lg sm:w-20" />
                    <Skeleton className="h-9 w-full rounded-lg sm:w-20" />
                    <Skeleton className="h-9 w-full rounded-lg sm:w-24" />
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
                {Array.from({ length: 24 }).map((_, i) => (
                    <CardGridItemSkeleton key={i} />
                ))}
            </div>
            </div>
        </CollectionProvider>
    );
}
