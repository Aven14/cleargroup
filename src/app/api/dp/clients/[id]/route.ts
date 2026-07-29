import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// GET - Récupérer un client
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(["MECANICIEN", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { id } = await params;

  const client = await prisma.dPClient.findUnique({
    where: { id },
    include: {
      repairs: {
        orderBy: { startedAt: "desc" },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
  }

  return NextResponse.json(client);
}

// PATCH - Mettre à jour un client
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(["MECANICIEN", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await request.json();
  const { firstname, lastname, phoneNumber, email, vehiclePlate, vehicleModel, hasDiscount } = body;
  const { id } = await params;

  const client = await prisma.dPClient.update({
    where: { id },
    data: {
      firstname,
      lastname,
      phoneNumber: phoneNumber || null,
      email: email || null,
      vehiclePlate: vehiclePlate?.toUpperCase(),
      vehicleModel,
      hasDiscount,
    },
    include: {
      repairs: {
        orderBy: { startedAt: "desc" },
      },
    },
  });

  return NextResponse.json(client);
}

// DELETE - Supprimer un client
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(["MECANICIEN", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { id } = await params;

  await prisma.dPClient.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
