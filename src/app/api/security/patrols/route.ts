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

  // Transformer les données pour inclure tous les agents dans un tableau
  const transformedPatrols = await Promise.all(patrols.map(async (patrol) => {
    const agents = [patrol.agent];
    if (patrol.coequipier) {
      agents.push(patrol.coequipier);
    }
    
    // Récupérer les agents supplémentaires
    if (patrol.additionalAgentIds && patrol.additionalAgentIds.length > 0) {
      const additionalAgents = await prisma.user.findMany({
        where: {
          id: { in: patrol.additionalAgentIds },
        },
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      });
      agents.push(...additionalAgents);
    }
    
    return {
      ...patrol,
      agents,
      maxAgents: patrol.maxAgents || 2,
    };
  }));

  return NextResponse.json(transformedPatrols);
}

// POST - Créer une nouvelle patrouille
export async function POST(request: NextRequest) {
  const auth = await requireUser(["SECURITY", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await request.json();
  const { coequipierId, sector, vehicle, missionType, observations, maxAgents } = body;

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
      maxAgents: Math.min(8, Math.max(1, maxAgents || 2)),
      additionalAgentIds: [],
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

  // Transformer la réponse pour inclure le tableau d'agents
  const transformedPatrol = {
    ...patrol,
    agents: [patrol.agent, ...(patrol.coequipier ? [patrol.coequipier] : [])],
    maxAgents: patrol.maxAgents || 2,
  };

  return NextResponse.json(transformedPatrol, { status: 201 });
}
