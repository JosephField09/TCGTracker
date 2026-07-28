import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getOrCreateUser() {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const existing = await prisma.user.findUnique({
        where: { id: userId },
        include: { collections: true },
    });
    if (existing) {
        if (existing.collections.length === 0) {
            await prisma.collection.create({
                data: {
                    name: "My Collection",
                    description: "Your default collection",
                    userId: existing.id,
                },
            });
            return prisma.user.findUnique({
                where: { id: userId },
                include: { collections: true },
            });
        }
        return existing;
    }

    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("Could not fetch Clerk user");

    const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
    const username = clerkUser.username ?? clerkUser.firstName ?? email.split("@")[0] ?? "trainer";

    return prisma.user.create({
        data: {
            id: userId,
            email,
            username,
            collections: {
                create: {
                    name: "My Collection",
                    description: "Your default collection",
                }
            },
        },
        include: { collections: true },
    });
}
