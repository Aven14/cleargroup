import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(["AMBULANCIER", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();

    // Nettoyer les antécédents de plus d'une semaine
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    await prisma.rescueMedicalHistory.deleteMany({
      where: {
        patientId: id,
        createdAt: { lt: oneWeekAgo },
      },
    });

    // Compter les antécédents actuels
    const currentCount = await prisma.rescueMedicalHistory.count({
      where: { patientId: id },
    });

    // Si déjà 10 antécédents, supprimer le plus ancien
    if (currentCount >= 10) {
      const oldestHistory = await prisma.rescueMedicalHistory.findFirst({
        where: { patientId: id },
        orderBy: { createdAt: "asc" },
      });
      if (oldestHistory) {
        await prisma.rescueMedicalHistory.delete({
          where: { id: oldestHistory.id },
        });
      }
    }

    // Créer le nouvel antécédent
    const history = await prisma.rescueMedicalHistory.create({
      data: {
        patientId: id,
        type: body.type,
        bilan: body.bilan || null,
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'antécédent:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
