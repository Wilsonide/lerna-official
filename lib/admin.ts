import { getCurrentUser } from "./current-user";

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return user;
}
