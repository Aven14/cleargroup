import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(["AMBULANCIER", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const patient = await prisma.rescuePatient.update({
      where: { id },
      data: {
        firstname: body.firstname,
        lastname: body.lastname,
        dateOfBirth: new Date(body.dateOfBirth),
        gender: body.gender,
        bloodType: body.bloodType || null,
        weight: body.weight ? parseFloat(body.weight) : null,
        height: body.height ? parseInt(body.height) : null,
        allergies: body.allergies || [],
        medications: body.medications || [],
      },
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du patient:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(["AMBULANCIER", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.rescuePatient.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du patient:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
