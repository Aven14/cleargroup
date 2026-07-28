import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { hasRole } from "@/lib/roles";

export default async function EspacePersonnelPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/clearbus/connexion");
  }

  // Rediriger vers la page appropriée selon le rôle
  if (hasRole(user.roles, "ADMIN")) {
    redirect("/admin");
  }
  if (hasRole(user.roles, "SECURITY")) {
    redirect("/clearsecurity/interne/tableau-de-bord");
  }
  if (hasRole(user.roles, "AMBULANCIER")) {
    redirect("/clearrescue/interne/tableau-de-bord");
  }
  if (hasRole(user.roles, "MECANICIEN")) {
    redirect("/cleardp/interne/tableau-de-bord");
  }
  if (hasRole(user.roles, "DRIVER")) {
    redirect("/clearbus/chauffeur");
  }
  if (hasRole(user.roles, "CONTROLLER")) {
    redirect("/clearbus/controleur");
  }

  // Par défaut, rediriger vers la page d'accueil
  redirect("/");
}
