import { auth } from "@clerk/nextjs/server";
import { getAlerts } from "@/app/actions/alerts";
import AlertsClient from "./AlertsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Price Alerts | TCGTracker",
};

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
    await auth.protect();
    const alerts = await getAlerts();
    return <AlertsClient alerts={alerts} />;
}
