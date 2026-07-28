import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// PATCH - Mettre à jour une patrouille
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(["MECANICIEN", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await request.json();
  const { ended, available } = body;
  const { id } = await params;

  const updateData: any = {};
  if (ended !== undefined) {
    updateData.endedAt = ended ? new Date() : null;
  }
  if (available !== undefined) {
    updateData.available = available;
  }

  const patrol = await prisma.dPPatrol.update({
    where: { id },
    data: updateData,
    include: {
      mechanic: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
      coequipier: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    },
  });

  return NextResponse.json(patrol);
}

// DELETE - Supprimer une patrouille
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(["MECANICIEN", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { id } = await params;

  await prisma.dPPatrol.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
