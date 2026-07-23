"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";

interface Patient {
  id: string;
  firstname: string;
  lastname: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string | null;
  weight: number | null;
  height: number | null;
  allergies: string[];
  medications: string[];
  medicalHistory: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  insuranceNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function DossiersPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [newPatient, setNewPatient] = useState({
    firstname: "",
    lastname: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    weight: "",
    height: "",
    allergies: "",
    medications: "",
    medicalHistory: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    insuranceNumber: "",
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await fetch('/api/rescue/patients');
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = async () => {
    try {
      const allergiesArray = newPatient.allergies.split(',').map(a => a.trim()).filter(a => a);
      const medicationsArray = newPatient.medications.split(',').map(m => m.trim()).filter(m => m);

      const response = await fetch('/api/rescue/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPatient,
          allergies: allergiesArray,
          medications: medicationsArray,
          weight: newPatient.weight ? parseFloat(newPatient.weight) : null,
          height: newPatient.height ? parseInt(newPatient.height) : null,
        }),
      });
      if (response.ok) {
        await loadPatients();
        setNewPatient({
          firstname: "",
          lastname: "",
          dateOfBirth: "",
          gender: "",
          bloodType: "",
          weight: "",
          height: "",
          allergies: "",
          medications: "",
          medicalHistory: "",
          emergencyContactName: "",
          emergencyContactPhone: "",
          insuranceNumber: "",
        });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de la création du patient:', error);
    }
  };

  const handleUpdatePatient = async () => {
    if (!editingPatient) return;
    try {
      const allergiesArray = newPatient.allergies.split(',').map(a => a.trim()).filter(a => a);
      const medicationsArray = newPatient.medications.split(',').map(m => m.trim()).filter(m => m);

      const response = await fetch(`/api/rescue/patients/${editingPatient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPatient,
          allergies: allergiesArray,
          medications: medicationsArray,
          weight: newPatient.weight ? parseFloat(newPatient.weight) : null,
          height: newPatient.height ? parseInt(newPatient.height) : null,
        }),
      });
      if (response.ok) {
        await loadPatients();
        setEditingPatient(null);
        setNewPatient({
          firstname: "",
          lastname: "",
          dateOfBirth: "",
          gender: "",
          bloodType: "",
          weight: "",
          height: "",
          allergies: "",
          medications: "",
          medicalHistory: "",
          emergencyContactName: "",
          emergencyContactPhone: "",
          insuranceNumber: "",
        });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du patient:', error);
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce dossier médical ?")) {
      try {
        const response = await fetch(`/api/rescue/patients/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          await loadPatients();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du patient:', error);
      }
    }
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setNewPatient({
      firstname: patient.firstname,
      lastname: patient.lastname,
      dateOfBirth: patient.dateOfBirth.split('T')[0],
      gender: patient.gender,
      bloodType: patient.bloodType || "",
      weight: patient.weight?.toString() || "",
      height: patient.height?.toString() || "",
      allergies: patient.allergies.join(', '),
      medications: patient.medications.join(', '),
      medicalHistory: patient.medicalHistory || "",
      emergencyContactName: patient.emergencyContactName || "",
      emergencyContactPhone: patient.emergencyContactPhone || "",
      insuranceNumber: patient.insuranceNumber || "",
    });
    setShowCreateForm(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredPatients = patients.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    return (
      p.firstname.toLowerCase().includes(searchLower) ||
      p.lastname.toLowerCase().includes(searchLower) ||
      p.insuranceNumber?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="page-enter">
      <PageHeader
        brand="ClearRescue"
        title="Dossiers médicaux"
        subtitle="Gestion des fiches patients et informations médicales"
      />

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4 gap-4">
          <input
            type="text"
            className="input-field flex-1"
            placeholder="Rechercher par nom ou numéro d'assurance..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setEditingPatient(null);
              setNewPatient({
                firstname: "",
                lastname: "",
                dateOfBirth: "",
                gender: "",
                bloodType: "",
                weight: "",
                height: "",
                allergies: "",
                medications: "",
                medicalHistory: "",
                emergencyContactName: "",
                emergencyContactPhone: "",
                insuranceNumber: "",
              });
            }}
            className="btn-primary"
          >
            {showCreateForm ? "Annuler" : "Nouveau dossier"}
          </button>
        </div>

        {showCreateForm && (
          <div className="panel-soft p-6">
            <h3 className="mb-4 font-bold text-ink">
              {editingPatient ? "Modifier le dossier" : "Nouveau dossier patient"}
            </h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Prénom</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={newPatient.firstname}
                    onChange={(e) => setNewPatient({ ...newPatient, firstname: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Nom</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={newPatient.lastname}
                    onChange={(e) => setNewPatient({ ...newPatient, lastname: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Date de naissance</label>
                  <input
                    type="date"
                    className="input-field w-full"
                    value={newPatient.dateOfBirth}
                    onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Genre</label>
                  <select
                    className="input-field w-full"
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Poids (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input-field w-full"
                    value={newPatient.weight}
                    onChange={(e) => setNewPatient({ ...newPatient, weight: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Taille (cm)</label>
                  <input
                    type="number"
                    className="input-field w-full"
                    value={newPatient.height}
                    onChange={(e) => setNewPatient({ ...newPatient, height: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Groupe sanguin</label>
                  <select
                    className="input-field w-full"
                    value={newPatient.bloodType}
                    onChange={(e) => setNewPatient({ ...newPatient, bloodType: e.target.value })}
                  >
                    <option value="">Inconnu</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Allergies (séparées par des virgules)</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Arachides, Pénicilline"
                  value={newPatient.allergies}
                  onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Médicaments (séparés par des virgules)</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Ex: Aspirine, Insuline"
                  value={newPatient.medications}
                  onChange={(e) => setNewPatient({ ...newPatient, medications: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Antécédents médicaux</label>
                <textarea
                  className="input-field w-full min-h-[80px]"
                  placeholder="Historique médical..."
                  value={newPatient.medicalHistory}
                  onChange={(e) => setNewPatient({ ...newPatient, medicalHistory: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Contact urgence (Nom)</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={newPatient.emergencyContactName}
                    onChange={(e) => setNewPatient({ ...newPatient, emergencyContactName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-muted">Contact urgence (Téléphone)</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={newPatient.emergencyContactPhone}
                    onChange={(e) => setNewPatient({ ...newPatient, emergencyContactPhone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-muted">Numéro d&apos;assurance</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={newPatient.insuranceNumber}
                  onChange={(e) => setNewPatient({ ...newPatient, insuranceNumber: e.target.value })}
                />
              </div>
              <button
                onClick={editingPatient ? handleUpdatePatient : handleCreatePatient}
                className="btn-primary w-full"
              >
                {editingPatient ? "Mettre à jour" : "Créer le dossier"}
              </button>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-ink">
          Dossiers ({filteredPatients.length})
        </h2>
        {loading ? (
          <div className="panel-soft p-6 text-center text-muted">Chargement...</div>
        ) : filteredPatients.length === 0 ? (
          <div className="panel-soft p-6 text-center text-muted">
            {searchTerm ? "Aucun résultat" : "Aucun dossier médical"}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="panel-soft p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-ink">
                      {patient.firstname} {patient.lastname}
                    </h3>
                    <p className="text-sm text-muted">
                      {calculateAge(patient.dateOfBirth)} ans · {patient.gender}
                    </p>
                  </div>
                  {patient.bloodType && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                      {patient.bloodType}
                    </span>
                  )}
                </div>
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Poids:</span>
                    <span className="text-ink">{patient.weight ? `${patient.weight} kg` : "-"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Taille:</span>
                    <span className="text-ink">{patient.height ? `${patient.height} cm` : "-"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Né(e) le:</span>
                    <span className="text-ink">{formatDate(patient.dateOfBirth)}</span>
                  </div>
                </div>
                {patient.allergies.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-muted mb-1">Allergies:</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies.map((allergy, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {patient.medications.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-muted mb-1">Médicaments:</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.medications.map((med, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {patient.emergencyContactName && (
                  <div className="mb-4 p-2 bg-yellow-50 rounded">
                    <p className="text-xs text-muted">Contact urgence:</p>
                    <p className="text-sm text-ink">{patient.emergencyContactName}</p>
                    {patient.emergencyContactPhone && (
                      <p className="text-sm text-ink">{patient.emergencyContactPhone}</p>
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditPatient(patient)}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeletePatient(patient.id)}
                    className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
