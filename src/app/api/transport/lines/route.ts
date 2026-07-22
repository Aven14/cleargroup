import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Récupérer les lignes de transport actives (avec chauffeurs en service)
export async function GET() {
  const activeLines = await prisma.driverShift.findMany({
    where: {
      endedAt: null,
    },
    include: {
      line: {
        include: {
          stops: {
            orderBy: { order: 'asc' },
          },
        },
      },
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    },
    orderBy: {
      startedAt: 'desc',
    },
  });

  return NextResponse.json(activeLines);
}
