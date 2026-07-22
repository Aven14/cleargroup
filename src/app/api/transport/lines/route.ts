import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Récupérer toutes les lignes de transport
export async function GET() {
  const lines = await prisma.transportLine.findMany({
    include: {
      stops: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { number: 'asc' },
  });

  return NextResponse.json(lines);
}
