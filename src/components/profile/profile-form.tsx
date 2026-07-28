"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/actions/profile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProfileFormProps {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    roles: string[];
    createdAt: Date;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [email, setEmail] = useState(user.email.replace("@a4l.fr", ""));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await updateProfile({
        firstname,
        lastname,
        email,
      });
      if (res.success) {
        setSuccess("Profil mis à jour avec succès.");
      } else {
        setError(res.error ?? "Erreur lors de la mise à jour.");
      }
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="mb-4 font-bold text-ink">Informations personnelles</h3>
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-line">
            <span className="text-muted">Compte créé le</span>
            <span className="text-ink">{formatDate(user.createdAt)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-line">
            <span className="text-muted">Rôle</span>
            <span className="text-ink capitalize">{user.roles.join(", ")}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-bold text-ink">Modifier mes informations</h3>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-caps mb-1 block">Prénom</label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label-caps mb-1 block">Nom</label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>
          <div className="relative">
            <label className="label-caps mb-1 block">Email (@a4l.fr)</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pr-24"
              required
              placeholder="ex: jean.dupont"
            />
            <span className="absolute right-4 top-8 text-muted pointer-events-none opacity-60">
              @a4l.fr
            </span>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}
      {success && <p className="text-sm text-primary">{success}</p>}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? <LoadingSpinner /> : "Enregistrer les modifications"}
      </button>
    </form>
  );
}
