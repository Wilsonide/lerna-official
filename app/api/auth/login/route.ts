import bcrypt from "bcryptjs";

import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

import { signToken } from "@/lib/auth";

import { loginSchema } from "@/lib/validators/login";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "Invalid data",
        },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json(
        {
          error: "Invalid credentials",
        },
        { status: 401 },
      );
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return Response.json(
        {
          error: "Invalid credentials",
        },
        { status: 401 },
      );
    }

    const token = signToken(user.id);

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({
      success: true,
    });
  } catch {
    return Response.json(
      {
        error: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
