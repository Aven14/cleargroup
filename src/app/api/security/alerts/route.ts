import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// GET - Récupérer toutes les alertes
export async function GET() {
  const auth = await requireUser(["SECURITY", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const alerts = await prisma.securityAlert.findMany({
    include: {
      createdBy: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
      responses: {
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(alerts);
}

// POST - Créer une nouvelle alerte
export async function POST(request: NextRequest) {
  const auth = await requireUser(["SECURITY", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await request.json();
  const { type, location, description, agentsRequested } = body;

  if (!type || !location || !description) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const alert = await prisma.securityAlert.create({
    data: {
      type,
      location,
      description,
      agentsRequested: agentsRequested || 1,
      createdById: auth.user.id,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
      responses: {
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(alert, { status: 201 });
}
