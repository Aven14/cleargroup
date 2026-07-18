import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// PATCH - Mettre à jour ou terminer une patrouille
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireUser(["SECURITY", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await request.json();
  const { missionType, observations, ended } = body;

  const updateData: { missionType?: string; observations?: string; endedAt?: Date } = {};
  if (missionType !== undefined) updateData.missionType = missionType;
  if (observations !== undefined) updateData.observations = observations;
  if (ended) updateData.endedAt = new Date();

  const patrol = await prisma.securityPatrol.update({
    where: { id: params.id },
    data: updateData,
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

  return NextResponse.json(patrol);
}
