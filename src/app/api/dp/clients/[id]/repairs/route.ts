import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// POST - Ajouter une réparation à un client
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(["MECANICIEN", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await request.json();
  const { description } = body;
  const { id } = await params;

  // Créer la réparation
  const repair = await prisma.dPRepair.create({
    data: {
      clientId: id,
      mechanicId: auth.user.id,
      vehiclePlate: "À spécifier",
      vehicleModel: "À spécifier",
      repairType: "Réparation standard",
      description: description || null,
      laborHours: 1,
      laborCost: 50,
      partsCost: 0,
      totalCost: 50,
      finalCost: 50,
      discountApplied: false,
      status: "En cours",
    },
  });

  // Mettre à jour le compteur de réparations du client
  const client = await prisma.dPClient.update({
    where: { id },
    data: {
      totalRepairs: {
        increment: 1,
      },
      loyaltyPoints: {
        increment: 10,
      },
    },
    include: {
      repairs: true,
    },
  });

  // Vérifier si le nombre de réparations atteint 10 pour activer la remise
  if (client.totalRepairs % 10 === 0 && !client.hasDiscount) {
    await prisma.dPClient.update({
      where: { id },
      data: {
        hasDiscount: true,
      },
    });
  }

  return NextResponse.json(repair, { status: 201 });
}
