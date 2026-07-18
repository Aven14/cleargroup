import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// PATCH - Terminer un shift de service
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const auth = await requireUser(["SECURITY", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const shift = await prisma.securityServiceShift.update({
    where: { id: params.id },
    data: { endedAt: new Date() },
    include: {
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    },
  });

  return NextResponse.json(shift);
}
