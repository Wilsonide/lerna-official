import { prisma } from "@/lib/prisma";

async function makeAdmin(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        role: "ADMIN",
      },
    });

    console.log(`✅ ${user.email} is now an ADMIN`);
  } catch (err) {
    console.error("❌ Failed to update user:", err);
  } finally {
    await prisma.$disconnect();
  }
}

// 👇 CHANGE THIS EMAIL
makeAdmin("ichekuwilson538@gmail.com");
