import { auth } from "@clerk/nextjs/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { userId } = await auth();
    
    return (
        <div className="flex flex-col min-h-screen bg-lavender">
            <Header isAuthenticated={userId !== null} />
            {/* Main Content */}
            <main className="flex-1 p-6">
                {children}
            </main>
            <Footer />
        </div>
    );
}