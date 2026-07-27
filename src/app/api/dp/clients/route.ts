import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// GET - Récupérer tous les clients
export async function GET() {
  const auth = await requireUser(["MECANICIEN", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const clients = await prisma.dPClient.findMany({
    include: {
      repairs: {
        orderBy: { startedAt: "desc" },
        take: 10,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(clients);
}

// POST - Créer un nouveau client
export async function POST(request: NextRequest) {
  const auth = await requireUser(["MECANICIEN", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await request.json();
  const { firstname, lastname, phoneNumber, email, vehiclePlate, vehicleModel } = body;

  const client = await prisma.dPClient.create({
    data: {
      firstname,
      lastname,
      phoneNumber: phoneNumber || null,
      email: email || null,
      vehiclePlate: vehiclePlate.toUpperCase(),
      vehicleModel,
      createdBy: auth.user.id,
    },
    include: {
      repairs: true,
    },
  });

  return NextResponse.json(client, { status: 201 });
}
