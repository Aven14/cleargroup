"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await registerUser({
        email: fd.get("email") as string,
        password: fd.get("password") as string,
        firstname: fd.get("firstname") as string,
        lastname: fd.get("lastname") as string,
      });
      if (res.success) {
        setSuccess(res.message ?? "Compte créé.");
        if (res.redirect) {
          setTimeout(() => router.push(res.redirect!), 1000);
        }
      } else {
        setError(res.error ?? "Erreur");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="panel space-y-4 p-6">
      <p className="text-sm text-muted">
        Utilisez votre identité RP pour le nom et prénom. L&apos;email sera automatiquement complété avec @a4l.fr
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-caps mb-1 block">Prénom RP</label>
          <input name="firstname" className="input-field" required />
        </div>
        <div>
          <label className="label-caps mb-1 block">Nom RP</label>
          <input name="lastname" className="input-field" required />
        </div>
      </div>
      <div className="relative">
        <label className="label-caps mb-1 block">Nom d&apos;utilisateur (email sans @a4l.fr)</label>
        <input name="email" className="input-field pr-24" required placeholder="ex: jean.dupont" />
        <span className="absolute right-4 top-8 text-muted pointer-events-none opacity-60">
          @a4l.fr
        </span>
      </div>
      <div>
        <label className="label-caps mb-1 block">Mot de passe</label>
        <input name="password" type="password" className="input-field" minLength={8} required />
        <p className="mt-1 text-xs text-muted">8 caractères minimum</p>
      </div>
      {error && <p className="text-sm text-accent">{error}</p>}
      {success && <p className="text-sm text-primary">{success}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? <LoadingSpinner /> : "Créer mon compte"}
      </button>
    </form>
  );
}
