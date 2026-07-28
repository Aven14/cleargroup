"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function updateProfile(data: {
  firstname: string;
  lastname: string;
  email: string;
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    return { success: false, error: "Non connecté." };
  }

  const firstname = data.firstname.trim();
  const lastname = data.lastname.trim();
  const emailInput = data.email.trim().toLowerCase();

  // Ajouter @a4l.fr automatiquement
  const email = emailInput.endsWith("@a4l.fr") ? emailInput : `${emailInput}@a4l.fr`;

  if (!email || !firstname || !lastname) {
    return { success: false, error: "Tous les champs sont requis." };
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email,
        firstname,
        lastname,
      },
    });

    revalidatePath("/espace-personnel");

    return { success: true, message: "Profil mis à jour." };
  } catch {
    return { success: false, error: "Erreur lors de la mise à jour." };
  }
}
