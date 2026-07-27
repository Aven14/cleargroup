import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// GET - Récupérer toutes les réparations
export async function GET() {
  const auth = await requireUser(["MECANICIEN", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const repairs = await prisma.dPRepair.findMany({
    include: {
      client: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          vehiclePlate: true,
          vehicleModel: true,
          hasDiscount: true,
        },
      },
      mechanic: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    },
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json(repairs);
}

// POST - Créer une nouvelle réparation
export async function POST(request: NextRequest) {
  const auth = await requireUser(["MECANICIEN", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await request.json();
  const {
    clientId,
    vehiclePlate,
    vehicleModel,
    repairType,
    description,
    partsReplaced,
    laborHours,
    laborCost,
    partsCost,
  } = body;

  // Récupérer le client pour vérifier s'il a droit à la réduction
  const client = await prisma.dPClient.findUnique({
    where: { id: clientId },
  });

  if (!client) {
    return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
  }

  const totalCost = parseFloat(laborCost) + parseFloat(partsCost);
  const REPAIRS_FOR_DISCOUNT = 5;
  const discountApplied = client.hasDiscount;
  let discountAmount = 0;
  let finalCost = totalCost;

  if (discountApplied) {
    discountAmount = totalCost * 0.5;
    finalCost = totalCost - discountAmount;
  }

  const repair = await prisma.dPRepair.create({
    data: {
      clientId,
      mechanicId: auth.user.id,
      vehiclePlate: vehiclePlate.toUpperCase(),
      vehicleModel,
      repairType,
      description,
      partsReplaced: partsReplaced || [],
      laborHours: parseFloat(laborHours),
      laborCost: parseFloat(laborCost),
      partsCost: parseFloat(partsCost),
      totalCost,
      discountApplied,
      discountAmount: discountApplied ? discountAmount : null,
      finalCost,
    },
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

  // Mettre à jour le client
  const newTotalRepairs = client.totalRepairs + 1;
  const newHasDiscount = newTotalRepairs >= REPAIRS_FOR_DISCOUNT;
  const newLoyaltyPoints = client.loyaltyPoints + 1;

  await prisma.dPClient.update({
    where: { id: clientId },
    data: {
      totalRepairs: newTotalRepairs,
      loyaltyPoints: newLoyaltyPoints,
      hasDiscount: newHasDiscount,
    },
  });

  return NextResponse.json(repair, { status: 201 });
}
