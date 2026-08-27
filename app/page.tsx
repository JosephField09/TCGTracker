import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTrendingCards } from "@/app/actions/trending";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LandingPage from "@/components/landing/LandingPage";

export default async function HomePage() {
    const { userId } = await auth();
    if (userId) redirect("/dashboard");

    const trendingCards = await getTrendingCards();

    return (
        <div className="flex flex-col min-h-screen bg-lavender">
            <Header isAuthenticated={false} />
            <main className="flex-1">
                <LandingPage trendingCards={trendingCards} />
            </main>
            <Footer />
        </div>
    );
}
