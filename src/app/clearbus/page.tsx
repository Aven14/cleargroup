import { redirect } from "next/navigation";

export default function ClearBusPage() {
  redirect("/clearbus/lignes");
}
