import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { verifyToken } from "./auth";

export async function getCurrentUser() {
  const token = (await cookies()).get("token")?.value;

  if (!token) return null;

  try {
    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    return user;
  } catch {
    return null;
  }
}
