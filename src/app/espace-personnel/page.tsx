import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { hasRole } from "@/lib/roles";
import { PageHeader } from "@/components/ui/page-header";

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

  // Pour les CIVIL, afficher leur espace personnel
  return (
    <div className="page-enter mx-auto max-w-4xl px-4">
      <PageHeader
        title="Mon espace"
        subtitle="Gérez vos informations personnelles"
      />

      <div className="panel-soft p-6 space-y-6">
        <div>
          <h3 className="mb-4 font-bold text-ink">Informations personnelles</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted">Nom</span>
              <span className="text-ink">{user.firstname} {user.lastname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Email</span>
              <span className="text-ink">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Rôle</span>
              <span className="text-ink">Civil</span>
            </div>
          </div>
        </div>

        <div className="border-t border-line pt-6">
          <h3 className="mb-4 font-bold text-ink">Services disponibles</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <a href="/clearbus" className="panel-soft p-4 hover:shadow-lg transition-shadow">
              <h4 className="font-bold text-ink">ClearBus</h4>
              <p className="text-sm text-muted">Transport en commun</p>
            </a>
            <a href="/clearsecurity" className="panel-soft p-4 hover:shadow-lg transition-shadow">
              <h4 className="font-bold text-ink">ClearSecurity</h4>
              <p className="text-sm text-muted">Sécurité</p>
            </a>
            <a href="/clearrescue" className="panel-soft p-4 hover:shadow-lg transition-shadow">
              <h4 className="font-bold text-ink">ClearRescue</h4>
              <p className="text-sm text-muted">Services médicaux</p>
            </a>
            <a href="/cleardp" className="panel-soft p-4 hover:shadow-lg transition-shadow">
              <h4 className="font-bold text-ink">ClearDP</h4>
              <p className="text-sm text-muted">Dépannage</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
