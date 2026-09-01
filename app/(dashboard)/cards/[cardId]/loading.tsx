import Skeleton from "@/components/ui/Skeleton";

function BadgeSkeleton() {
    return <Skeleton className="h-6 w-16 rounded-full" />;
}

export default function CardLoading() {
    return (
        <div className="space-y-5 w-8/12 mx-auto">
            {/* Breadcrumb */}
            <div className="flex gap-2 items-center text-sm">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-2" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-2" />
                <Skeleton className="h-4 w-40" />
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-[345px_1fr] gap-6">
                {/* Left Section - Card Image */}
                <div className="space-y-4">
                    <Skeleton className="w-full aspect-[2/3] rounded-2xl" />
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                </div>

                {/* Right Section */}
                <div className="space-y-4">
                    {/* Card info box */}
                    <div className="bg-white border border-wisteria rounded-2xl p-6 space-y-4">
                        <div className="flex flex-row justify-between">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-8 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-1 w-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-56" />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <BadgeSkeleton />
                            <BadgeSkeleton />
                            <BadgeSkeleton />
                        </div>
                    </div>

                    {/* Price section */}
                    <div className="bg-white border border-wisteria rounded-2xl p-6 space-y-3">
                        <Skeleton className="h-5 w-24" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>

                    {/* Collection section */}
                    <div className="bg-white border border-wisteria rounded-2xl p-6 space-y-3">
                        <Skeleton className="h-5 w-32" />
                        <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Price history chart */}
            <div className="bg-white border border-wisteria rounded-2xl p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-64 w-full" />
            </div>

            {/* Related cards section */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="w-full aspect-[2/3] rounded-lg" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
