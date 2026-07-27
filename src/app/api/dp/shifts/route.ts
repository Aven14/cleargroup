import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// GET - Récupérer tous les shifts de service
export async function GET() {
  const auth = await requireUser(["MECANICIEN", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const shifts = await prisma.dPServiceShift.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          roles: true,
        },
      },
    },
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json(shifts);
}

// POST - Créer un nouveau shift de service
export async function POST(request: NextRequest) {
  const auth = await requireUser(["MECANICIEN", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await request.json();
  const { vehicle } = body;

  const shift = await prisma.dPServiceShift.create({
    data: {
      userId: auth.user.id,
      vehicle: vehicle || null,
    },
    include: {
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          roles: true,
        },
      },
    },
  });

  return NextResponse.json(shift, { status: 201 });
}
