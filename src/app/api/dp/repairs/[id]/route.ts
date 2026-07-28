import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// PATCH - Mettre à jour une réparation (statut, notes, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(["MECANICIEN", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await request.json();
  const { status, notes } = body;
  const { id } = await params;

  const updateData: { status?: string; notes?: string; completedAt?: Date } = {};
  if (status) updateData.status = status;
  if (notes !== undefined) updateData.notes = notes;
  
  if (status === "Terminée") {
    updateData.completedAt = new Date();
  }

  const repair = await prisma.dPRepair.update({
    where: { id },
    data: updateData,
    include: {
      client: true,
      mechanic: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    },
  });

  return NextResponse.json(repair);
}

// DELETE - Supprimer une réparation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(["MECANICIEN", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { id } = await params;

  const repair = await prisma.dPRepair.findUnique({
    where: { id },
  });

  if (!repair) {
    return NextResponse.json({ error: "Réparation non trouvée" }, { status: 404 });
  }

  await prisma.dPRepair.delete({
    where: { id },
  });

  // Décrémenter le compteur de réparations du client
  await prisma.dPClient.update({
    where: { id: repair.clientId },
    data: {
      totalRepairs: {
        decrement: 1,
      },
      loyaltyPoints: {
        decrement: 1,
      },
    },
  });

  return NextResponse.json({ success: true });
}
