"use server";

import { authClient } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";

export async function banUser(userId: string, banReason: string) {
  try {
    await authClient.admin.banUser({
      userId,
      banReason,
      banExpiresIn: 60 * 60 * 24 * 7, // 7 days
    });
    return { success: true, message: "User banned successfully" };
  } catch (error) {
    console.error("Failed to ban user:", error);
    return { success: false, message: "Failed to ban user" };
  }
}

export async function unbanUser(userId: string) {
  try {
    await authClient.admin.unbanUser({ userId });
    return { success: true, message: "User unbanned successfully" };
  } catch (error) {
    console.error("Failed to unban user:", error);
    return { success: false, message: "Failed to unban user" };
  }
}

const user = await prisma.user.findUnique({
    where: { id: "user_id_here" },
    select: { role: true },
  });
  console.log(user?.role); // Should print 'admin'
  