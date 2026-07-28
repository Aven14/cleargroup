"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { getLoginRedirect } from "@/lib/roles";
import {
  createSession,
  destroySession,
  getCurrentUser,
} from "@/lib/session";

export async function registerUser(data: {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}) {
  const firstname = data.firstname.trim();
  const lastname = data.lastname.trim();
  const password = data.password;
  const emailInput = data.email.trim().toLowerCase();

  // Ajouter @a4l.fr automatiquement
  const email = emailInput.endsWith("@a4l.fr") ? emailInput : `${emailInput}@a4l.fr`;

  if (!email || !password || !firstname || !lastname) {
    return { success: false, error: "Tous les champs sont requis." };
  }

  if (password.length < 8) {
    return { success: false, error: "Mot de passe : 8 caractères minimum." };
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return { success: false, error: "Cet email est déjà utilisé." };
  }

  try {
    await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
        firstname,
        lastname,
        roles: ["CIVIL"],
      },
    });

    // Logger l'inscription
    const { createLog } = await import("@/actions/logs");
    await createLog({
      action: "REGISTER",
      entity: "User",
      details: `Nouvel utilisateur: ${firstname} ${lastname} (${email})`,
    });

    // Connecter automatiquement l'utilisateur
    await destroySession();
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await createSession(user.id);
      
      // Logger la connexion
      await createLog({
        action: "LOGIN",
        entity: "User",
        entityId: user.id,
        details: `${user.firstname} ${user.lastname}`,
      });
    }

    return {
      success: true,
      message: "Compte créé avec succès.",
      redirect: getLoginRedirect(["CIVIL"]),
    };
  } catch {
    return { success: false, error: "Erreur lors de l'inscription." };
  }
}

export async function loginUser(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) {
    return { success: false, error: "Email et mot de passe requis." };
  }

  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { success: false, error: "Email ou mot de passe incorrect." };
  }

  await destroySession();
  await createSession(user.id);

  // Logger la connexion
  const { createLog } = await import("@/actions/logs");
  await createLog({
    action: "LOGIN",
    entity: "User",
    entityId: user.id,
    details: `${user.firstname} ${user.lastname}`,
  });

  revalidatePath("/");

  return {
    success: true,
    roles: user.roles,
    redirect: getLoginRedirect(user.roles),
  };
}

export async function logoutUser() {
  const user = await getCurrentUser();
  
  await destroySession();
  
  // Logger la déconnexion
  if (user) {
    const { createLog } = await import("@/actions/logs");
    await createLog({
      action: "LOGOUT",
      entity: "User",
      entityId: user.id,
      details: `${user.firstname} ${user.lastname}`,
    });
  }
  
  revalidatePath("/");
  return { success: true };
}

export async function getSessionUser() {
  return getCurrentUser();
}
