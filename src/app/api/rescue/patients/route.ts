import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function GET() {
  const auth = await requireUser(["AMBULANCIER", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    const patients = await prisma.rescuePatient.findMany({
      include: {
        medicalHistories: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Erreur lors du chargement des patients:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireUser(["AMBULANCIER", "ADMIN"]);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    const body = await request.json();
    const patient = await prisma.rescuePatient.create({
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
    console.error("Erreur lors de la création du patient:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
