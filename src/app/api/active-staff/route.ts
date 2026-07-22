import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface SecurityShiftWithUser {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    roles: string[];
  };
  startedAt: Date;
}

interface DriverShiftWithUser {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    roles: string[];
  };
  startedAt: Date;
  line: {
    number: number;
    name: string;
  } | null;
}

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
    ...activeShifts.map((shift: SecurityShiftWithUser) => ({
      id: shift.user.id,
      firstname: shift.user.firstname,
      lastname: shift.user.lastname,
      roles: shift.user.roles,
      type: 'SECURITY' as const,
      startedAt: shift.startedAt,
      line: null,
    })),
    ...activeDriverShifts.map((shift: DriverShiftWithUser) => ({
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
