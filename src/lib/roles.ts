import type { UserRole } from "@prisma/client";

export const ROLE_LABELS: Record<UserRole, string> = {
  CIVIL: "Civil",
  DRIVER: "Chauffeur",
  CONTROLLER: "Contrôleur",
  ADMIN: "Administrateur",
  SECURITY: "Agent de sécurité",
  AMBULANCIER: "Ambulancier",
};

export const ASSIGNABLE_ROLES: UserRole[] = [
  "CIVIL",
  "DRIVER",
  "CONTROLLER",
  "ADMIN",
  "SECURITY",
  "AMBULANCIER",
];

export function hasRole(userRoles: UserRole[], role: UserRole): boolean {
  return userRoles.includes(role);
}

export function hasAnyRole(
  userRoles: UserRole[],
  required: UserRole[]
): boolean {
  return required.some((r) => userRoles.includes(r));
}

export function getLoginRedirect(roles: UserRole[]): string {
  if (hasRole(roles, "ADMIN")) return "/admin";
  if (hasRole(roles, "SECURITY")) return "/clearsecurity/interne/tableau-de-bord";
  if (hasRole(roles, "DRIVER")) return "/clearbus/chauffeur";
  if (hasRole(roles, "CONTROLLER")) return "/clearbus/controleur";
  return "/clearbus/espace-personnel";
}

export function formatRoles(roles: UserRole[]): string {
  return roles.map((r) => ROLE_LABELS[r]).join(", ");
}