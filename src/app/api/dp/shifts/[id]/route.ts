import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// PATCH - Terminer un shift de service
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(["MECANICIEN", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { id } = await params;

  const shift = await prisma.dPServiceShift.update({
    where: { id },
    data: { endedAt: new Date() },
  });

  return NextResponse.json(shift);
}
