import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// POST - Rejoindre une patrouille
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(["SECURITY", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { id: patrolId } = await params;

  // Vérifier que la patrouille existe et est active
  const patrol = await prisma.securityPatrol.findUnique({
    where: { id: patrolId },
    include: {
      agent: true,
      coequipier: true,
    },
  });

  if (!patrol) {
    return NextResponse.json({ error: "Patrouille non trouvée" }, { status: 404 });
  }

  if (patrol.endedAt) {
    return NextResponse.json({ error: "Patrouille terminée" }, { status: 400 });
  }

  // Vérifier que l'utilisateur n'est pas déjà dans la patrouille
  if (patrol.agentId === auth.user.id || patrol.coequipierId === auth.user.id || 
      (patrol.additionalAgentIds && patrol.additionalAgentIds.includes(auth.user.id))) {
    return NextResponse.json({ error: "Déjà dans la patrouille" }, { status: 400 });
  }

  // Calculer le nombre actuel d'agents
  const currentAgents = 1 + (patrol.coequipierId ? 1 : 0) + (patrol.additionalAgentIds?.length || 0);
  const maxAgents = patrol.maxAgents || 2;

  if (currentAgents >= maxAgents) {
    return NextResponse.json({ error: "Patrouille complète" }, { status: 400 });
  }

  // Ajouter l'utilisateur aux agents supplémentaires
  const updatedPatrol = await prisma.securityPatrol.update({
    where: { id: patrolId },
    data: {
      additionalAgentIds: [...(patrol.additionalAgentIds || []), auth.user.id],
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

  // Récupérer les agents supplémentaires
  const additionalAgents = await prisma.user.findMany({
    where: {
      id: { in: updatedPatrol.additionalAgentIds || [] },
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
    },
  });

  const transformedPatrol = {
    ...updatedPatrol,
    agents: [updatedPatrol.agent, ...(updatedPatrol.coequipier ? [updatedPatrol.coequipier] : []), ...additionalAgents],
    maxAgents: updatedPatrol.maxAgents || 2,
  };

  return NextResponse.json(transformedPatrol);
}
