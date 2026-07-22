import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Récupérer tout le personnel en service (ClearBus et ClearSecurity)
export async function GET() {
  const activeShifts = await prisma.securityServiceShift.findMany({
    where: {
      endedAt: null,
    },
    include: {
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          roles: true,
        },
      },
    },
  });

  const activeDriverShifts = await prisma.driverShift.findMany({
    where: {
      endedAt: null,
    },
    include: {
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          roles: true,
        },
      },
      line: {
        select: {
          number: true,
          name: true,
        },
      },
    },
  });

  const activeStaff = [
    ...activeShifts.map((shift: any) => ({
      id: shift.user.id,
      firstname: shift.user.firstname,
      lastname: shift.user.lastname,
      roles: shift.user.roles,
      type: 'SECURITY' as const,
      startedAt: shift.startedAt,
      line: null,
    })),
    ...activeDriverShifts.map((shift: any) => ({
      id: shift.user.id,
      firstname: shift.user.firstname,
      lastname: shift.user.lastname,
      roles: shift.user.roles,
      type: 'DRIVER' as const,
      startedAt: shift.startedAt,
      line: shift.line,
    })),
  ];

  return NextResponse.json(activeStaff);
}
