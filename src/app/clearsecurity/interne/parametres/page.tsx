"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "Général", icon: "⚙️" },
    { id: "grades", label: "Grades", icon: "🎖️" },
    { id: "matricules", label: "Matricules", icon: "🔢" },
    { id: "permissions", label: "Permissions", icon: "🔐" },
    { id: "equipes", label: "Équipes", icon: "👥" },
    { id: "vehicules", label: "Véhicules", icon: "🚗" },
    { id: "equipements", label: "Équipements", icon: "📦" },
  ];

  return (
    <div className="page-enter compact-layout">
      <PageHeader
        title="Paramètres"
        subtitle="Configuration du module ClearSecurity"
      />

      <section>
        <div className="flex gap-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-surface text-muted hover:bg-primary-light/40"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="panel-soft p-6">
          {activeTab === "general" && (
            <div>
              <h3 className="mb-4 font-bold text-ink">Paramètres généraux</h3>
              <div className="space-y-4">
                <div>
                  <label className="label-caps block mb-2">Nom de l&apos;organisation</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    defaultValue="ClearSecurity"
                  />
                </div>
                <div>
                  <label className="label-caps block mb-2">Temps de détention par défaut (minutes)</label>
                  <input
                    type="number"
                    className="input-field w-full"
                    defaultValue="30"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="auto-release"
                    defaultChecked
                  />
                  <label htmlFor="auto-release" className="text-sm text-ink">
                    Libération automatique à la fin du temps
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="notifications"
                    defaultChecked
                  />
                  <label htmlFor="notifications" className="text-sm text-ink">
                    Notifications d&apos;alertes en temps réel
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "grades" && (
            <div>
              <h3 className="mb-4 font-bold text-ink">Gestion des grades</h3>
              <p className="text-muted mb-4">Cette section permettra de gérer les grades et hiérarchies des agents.</p>
              <div className="panel-soft bg-muted/30 p-4 text-center">
                <span className="text-muted">Fonctionnalité à venir</span>
              </div>
            </div>
          )}

          {activeTab === "matricules" && (
            <div>
              <h3 className="mb-4 font-bold text-ink">Gestion des matricules</h3>
              <p className="text-muted mb-4">Cette section permettra de gérer les matricules des agents.</p>
              <div className="panel-soft bg-muted/30 p-4 text-center">
                <span className="text-muted">Fonctionnalité à venir</span>
              </div>
            </div>
          )}

          {activeTab === "permissions" && (
            <div>
              <h3 className="mb-4 font-bold text-ink">Gestion des permissions</h3>
              <p className="text-muted mb-4">Cette section permettra de gérer les permissions et accès des agents.</p>
              <div className="panel-soft bg-muted/30 p-4 text-center">
                <span className="text-muted">Fonctionnalité à venir</span>
              </div>
            </div>
          )}

          {activeTab === "equipes" && (
            <div>
              <h3 className="mb-4 font-bold text-ink">Gestion des équipes</h3>
              <p className="text-muted mb-4">Cette section permettra de gérer les équipes et affectations.</p>
              <div className="panel-soft bg-muted/30 p-4 text-center">
                <span className="text-muted">Fonctionnalité à venir</span>
              </div>
            </div>
          )}

          {activeTab === "vehicules" && (
            <div>
              <h3 className="mb-4 font-bold text-ink">Gestion des véhicules</h3>
              <p className="text-muted mb-4">Cette section permettra de gérer le parc de véhicules.</p>
              <div className="panel-soft bg-muted/30 p-4 text-center">
                <span className="text-muted">Fonctionnalité à venir</span>
              </div>
            </div>
          )}

          {activeTab === "equipements" && (
            <div>
              <h3 className="mb-4 font-bold text-ink">Gestion des équipements</h3>
              <p className="text-muted mb-4">Cette section permettra de gérer les équipements et matériel.</p>
              <div className="panel-soft bg-muted/30 p-4 text-center">
                <span className="text-muted">Fonctionnalité à venir</span>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-line/70">
            <button className="btn-primary w-full">
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
