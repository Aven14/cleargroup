import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; historyId: string }> }
) {
  const auth = await requireUser(["AMBULANCIER", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    const { historyId } = await params;
    await prisma.rescueMedicalHistory.delete({
      where: { id: historyId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'antécédent:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
