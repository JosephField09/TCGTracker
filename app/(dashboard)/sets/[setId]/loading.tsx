import Skeleton from "@/components/ui/Skeleton";
import { CollectionProvider } from "@/context/CollectionContext";

function CardGridItemSkeleton() {
    return (
        <div className="space-y-2">
            <Skeleton className="w-full aspect-[2/3] rounded-lg" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
        </div>
    );
}

export default function SetLoading() {
    return (
        <CollectionProvider initialMap={{}}>
            <div className="space-y-5 w-8/12 mx-auto">
            {/* Breadcrumb */}
            <div className="flex gap-2 items-center text-sm">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-2" />
                <Skeleton className="h-4 w-40" />
            </div>

            {/* Set Header */}
            <div className="bg-white border border-wisteria rounded-2xl p-6 space-y-4">
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
            <div className="flex flex-wrap gap-3 items-center">
                <Skeleton className="h-9 w-48 rounded-lg" />
                <Skeleton className="h-9 w-20 rounded-full" />
                <Skeleton className="h-9 w-20 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: 24 }).map((_, i) => (
                    <CardGridItemSkeleton key={i} />
                ))}
            </div>
            </div>
        </CollectionProvider>
    );
}
