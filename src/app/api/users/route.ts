import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function GET() {
  const auth = await requireUser(["ADMIN"]);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      roles: true,
    },
  });

  return NextResponse.json(users);
}
