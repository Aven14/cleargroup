"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/actions/auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      // Ajouter @a4l.fr automatiquement si non présent
      const normalizedEmail = email.endsWith("@a4l.fr") ? email : `${email}@a4l.fr`;
      
      const res = await loginUser(normalizedEmail, password);
      if (res.success && res.redirect) {
        router.push(redirectTo || res.redirect);
        router.refresh();
      } else {
        setError(res.error ?? "Erreur de connexion");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="panel space-y-4 p-6">
      <div className="relative">
        <label className="label-caps mb-1 block">Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field pr-24"
          required
          autoComplete="email"
          placeholder="ex: jean.dupont"
        />
        <span className="absolute right-4 top-8 text-muted pointer-events-none opacity-60">
          @a4l.fr
        </span>
      </div>
      <div>
        <label className="label-caps mb-1 block">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
          autoComplete="current-password"
        />
      </div>
      {error && (
        <p className="rounded-lg bg-accent-light px-3 py-2 text-sm text-accent">{error}</p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? <LoadingSpinner /> : "Se connecter"}
      </button>
    </form>
  );
}
