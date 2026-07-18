import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// PATCH - Clôturer une alerte
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireUser(["SECURITY", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await request.json();
  const { active } = body;

  const alert = await prisma.securityAlert.update({
    where: { id: params.id },
    data: {
      active: active === false ? false : true,
      closedAt: active === false ? new Date() : null,
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

  return NextResponse.json(alert);
}

// POST - Répondre à une alerte
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireUser(["SECURITY", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const response = await prisma.securityAlertResponse.create({
    data: {
      alertId: params.id,
      userId: auth.user.id,
    },
    include: {
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    },
  });

  const alert = await prisma.securityAlert.findUnique({
    where: { id: params.id },
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

  return NextResponse.json(alert);
}
