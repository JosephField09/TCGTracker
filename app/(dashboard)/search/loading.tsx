import Skeleton from "@/components/ui/Skeleton";

function SearchCardSkeleton() {
    return (
        <div className="bg-white border border-wisteria rounded-xl overflow-hidden">
            <Skeleton className="aspect-2/3 rounded-none" />
            <div className="p-2 space-y-1.5">
                <Skeleton className="h-2.5 w-4/5" />
                <Skeleton className="h-2 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
            </div>
        </div>
    );
}

export default function SearchLoading() {
    return (
        <div className="space-y-5 w-8/12 mx-auto">
            <Skeleton className="h-8 w-40" />

            <div className="flex flex-wrap gap-3 items-center">
                <Skeleton className="h-9 w-72 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="h-9 w-28 rounded-lg" />
                <Skeleton className="h-9 w-32 rounded-lg" />
                <Skeleton className="h-9 w-32 rounded-lg" />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {Array.from({ length: 30 }).map((_, index) => (
                    <SearchCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}
