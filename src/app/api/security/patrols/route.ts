import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// GET - Récupérer toutes les patrouilles
export async function GET() {
  const auth = await requireUser(["SECURITY", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const patrols = await prisma.securityPatrol.findMany({
    include: {
      agent: {
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
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json(patrols);
}

// POST - Créer une nouvelle patrouille
export async function POST(request: NextRequest) {
  const auth = await requireUser(["SECURITY", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await request.json();
  const { coequipierId, sector, vehicle, missionType, observations } = body;

  if (!sector || !vehicle) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const patrol = await prisma.securityPatrol.create({
    data: {
      agentId: auth.user.id,
      coequipierId: coequipierId || null,
      sector,
      vehicle,
      missionType: missionType || "Patrouille mobile",
      observations: observations || "",
    },
    include: {
      agent: {
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

  return NextResponse.json(patrol, { status: 201 });
}
