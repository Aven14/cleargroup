import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// GET - Récupérer tous les détenus actifs
export async function GET() {
  const auth = await requireUser(["SECURITY", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const detainees = await prisma.securityDetainee.findMany({
    where: { releasedAt: null },
    include: {
      agent: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    },
    orderBy: { enteredAt: "desc" },
  });

  return NextResponse.json(detainees);
}

// POST - Créer un nouveau détenu
export async function POST(request: NextRequest) {
  const auth = await requireUser(["SECURITY", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await request.json();
  const { firstname, lastname, detentionTime, reason } = body;

  if (!firstname || !lastname || !reason) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const detainee = await prisma.securityDetainee.create({
    data: {
      firstname,
      lastname,
      detentionTime: detentionTime || 30,
      reason,
      agentId: auth.user.id,
    },
    include: {
      agent: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    },
  });

  return NextResponse.json(detainee, { status: 201 });
}
