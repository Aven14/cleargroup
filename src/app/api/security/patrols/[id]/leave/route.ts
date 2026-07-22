import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// POST - Quitter une patrouille
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(["SECURITY", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { id: patrolId } = await params;

  // Vérifier que la patrouille existe
  const patrol = await prisma.securityPatrol.findUnique({
    where: { id: patrolId },
  });

  if (!patrol) {
    return NextResponse.json({ error: "Patrouille non trouvée" }, { status: 404 });
  }

  // Vérifier que l'utilisateur est dans la patrouille
  const isInPatrol = patrol.agentId === auth.user.id || 
                     patrol.coequipierId === auth.user.id ||
                     (patrol.additionalAgentIds && patrol.additionalAgentIds.includes(auth.user.id));

  if (!isInPatrol) {
    return NextResponse.json({ error: "Pas dans cette patrouille" }, { status: 400 });
  }

  // Si c'est le créateur, on ne peut pas quitter (il faut terminer la patrouille)
  if (patrol.agentId === auth.user.id) {
    return NextResponse.json({ error: "Le créateur ne peut pas quitter, terminez la patrouille" }, { status: 400 });
  }

  // Si c'est le coéquipier, on le retire
  if (patrol.coequipierId === auth.user.id) {
    const updatedPatrol = await prisma.securityPatrol.update({
      where: { id: patrolId },
      data: { coequipierId: null },
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

    const transformedPatrol = {
      ...updatedPatrol,
      agents: [updatedPatrol.agent],
      maxAgents: updatedPatrol.maxAgents || 2,
    };

    return NextResponse.json(transformedPatrol);
  }

  // Si c'est dans les agents supplémentaires, on le retire
  if (patrol.additionalAgentIds && patrol.additionalAgentIds.includes(auth.user.id)) {
    const updatedPatrol = await prisma.securityPatrol.update({
      where: { id: patrolId },
      data: {
        additionalAgentIds: patrol.additionalAgentIds.filter(id => id !== auth.user.id),
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

    // Récupérer les agents supplémentaires restants
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

  return NextResponse.json({ error: "Impossible de quitter" }, { status: 400 });
}
