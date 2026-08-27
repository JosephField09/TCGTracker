import { auth } from "@clerk/nextjs/server";
import { getProfileData } from "@/app/actions/profile";
import ProfileClient from "./ProfileClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile | TCGTracker",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    await auth.protect();
    const data = await getProfileData();
    return <ProfileClient {...data} />;
}
