import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { hasRole } from "@/lib/roles";
import { PageHeader } from "@/components/ui/page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { prisma } from "@/lib/prisma";

export default async function EspacePersonnelPage() {
  const sessionUser = await getCurrentUser();
  
  if (!sessionUser) {
    redirect("/clearbus/connexion");
  }

  // Rediriger vers la page appropriée selon le rôle
  if (hasRole(sessionUser.roles, "ADMIN")) {
    redirect("/admin");
  }
  if (hasRole(sessionUser.roles, "SECURITY")) {
    redirect("/clearsecurity/interne/tableau-de-bord");
  }
  if (hasRole(sessionUser.roles, "AMBULANCIER")) {
    redirect("/clearrescue/interne/tableau-de-bord");
  }
  if (hasRole(sessionUser.roles, "MECANICIEN")) {
    redirect("/cleardp/interne/tableau-de-bord");
  }
  if (hasRole(sessionUser.roles, "DRIVER")) {
    redirect("/clearbus/chauffeur");
  }
  if (hasRole(sessionUser.roles, "CONTROLLER")) {
    redirect("/clearbus/controleur");
  }

  // Récupérer l'utilisateur complet avec createdAt
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      roles: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/clearbus/connexion");
  }

  // Pour les CIVIL, afficher leur espace personnel
  return (
    <div className="page-enter mx-auto max-w-4xl px-4">
      <PageHeader
        title="Mon espace"
        subtitle="Gérez vos informations personnelles"
      />

      <div className="panel-soft p-6 space-y-6">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
