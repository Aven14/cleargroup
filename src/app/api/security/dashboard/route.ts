import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function GET() {
  const auth = await requireUser(["SECURITY", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  const [activeShifts, activePatrols, activeAlerts, activeDetainees, todayDebriefings] = await Promise.all([
    prisma.securityServiceShift.count({
      where: { endedAt: null },
    }),
    prisma.securityPatrol.count({
      where: { endedAt: null },
    }),
    prisma.securityAlert.count({
      where: { active: true },
    }),
    prisma.securityDetainee.count({
      where: { releasedAt: null },
    }),
    prisma.securityDebriefing.count({
      where: {
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
  ]);

  const recentAlerts = await prisma.securityAlert.findMany({
    where: { active: true },
    include: {
      createdBy: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentShifts = await prisma.securityServiceShift.findMany({
    where: { endedAt: null },
    include: {
      user: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
    },
    orderBy: { startedAt: "desc" },
    take: 5,
  });

  const recentPatrols = await prisma.securityPatrol.findMany({
    where: { endedAt: null },
    include: {
      agent: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
    },
    orderBy: { startedAt: "desc" },
    take: 5,
  });

  return NextResponse.json({
    stats: {
      activeShifts,
      activePatrols,
      activeAlerts,
      activeDetainees,
      todayDebriefings,
    },
    recentAlerts,
    recentShifts,
    recentPatrols,
  });
}
