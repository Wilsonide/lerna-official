import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

import { registerSchema } from "@/lib/validators/register";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "Invalid data",
        },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return Response.json(
        {
          error: "User already exists",
        },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });

    return Response.json(user);
  } catch {
    return Response.json(
      {
        error: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
