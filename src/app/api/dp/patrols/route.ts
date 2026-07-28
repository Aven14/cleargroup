import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// GET - Récupérer toutes les patrouilles
export async function GET() {
  const auth = await requireUser(["MECANICIEN", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const patrols = await prisma.dPPatrol.findMany({
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
    orderBy: { startedAt: "desc" },
  });

  // Transformer les données pour inclure tous les mécaniciens dans un tableau
  const transformedPatrols = await Promise.all(patrols.map(async (patrol) => {
    const mechanics = [patrol.mechanic];
    if (patrol.coequipier) {
      mechanics.push(patrol.coequipier);
    }
    
    // Récupérer les mécaniciens supplémentaires
    if (patrol.additionalMechanicIds && patrol.additionalMechanicIds.length > 0) {
      const additionalMechanics = await prisma.user.findMany({
        where: {
          id: { in: patrol.additionalMechanicIds },
        },
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      });
      mechanics.push(...additionalMechanics);
    }
    
    return {
      ...patrol,
      mechanics,
      maxMechanics: patrol.maxMechanics || 2,
    };
  }));

  return NextResponse.json(transformedPatrols);
}

// POST - Créer une nouvelle patrouille
export async function POST(request: NextRequest) {
  const auth = await requireUser(["MECANICIEN", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await request.json();
  const { coequipierId, sector, vehicle, observations, maxMechanics } = body;

  if (!sector || !vehicle) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const patrol = await prisma.dPPatrol.create({
    data: {
      mechanicId: auth.user.id,
      coequipierId: coequipierId || null,
      sector,
      vehicle,
      interventionType: "Dépannage",
      observations: observations || "",
      maxMechanics: Math.min(4, Math.max(1, maxMechanics || 4)),
      available: true,
      additionalMechanicIds: [],
    },
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

  // Transformer la réponse pour inclure le tableau de mécaniciens
  const transformedPatrol = {
    ...patrol,
    mechanics: [patrol.mechanic, ...(patrol.coequipier ? [patrol.coequipier] : [])],
    maxMechanics: patrol.maxMechanics || 2,
  };

  return NextResponse.json(transformedPatrol, { status: 201 });
}
