import { Suspense } from "react";
import { getSearchFilters } from '@/lib/search';
import { getOwnedVariantMap } from "@/app/actions/collection";
import SearchClient from "./SearchClient";
import SearchLoading from "./loading";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Search | TCGTracker",
};

export default async function SearchPage() {
    const [filterOptions, ownedVariantMap] = await Promise.all([
        getSearchFilters(),
        getOwnedVariantMap(),
    ]);

    return (
        <Suspense fallback={<SearchLoading />}>
            <SearchClient
                filterOptions={filterOptions}
                ownedVariantMap={ownedVariantMap}
            />
        </Suspense>
    );
}