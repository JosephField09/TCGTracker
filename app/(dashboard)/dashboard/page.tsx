import { auth } from "@clerk/nextjs/server";
import { getDashboardData } from "@/app/actions/dashboard";
import DashboardClient from "./DashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | TCGTracker",
};

export const dynamix = "force-dynamic";

export default async function DashboardPage() {
    await auth.protect();
    const data = await getDashboardData();
    return <DashboardClient {...data} />;
}
