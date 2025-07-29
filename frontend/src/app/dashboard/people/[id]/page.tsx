"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLoading from "../../loading";

interface Person {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function PersonDetailPage() {
  const params = useParams();
  const id = Number(params.id); // récupère l'ID (ex: 3)
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler une API ou appeler une vraie API
    setTimeout(() => {
      const mockPeople: Person[] = [
        { id: 1, name: "Alice Dupont", email: "alice@example.com", role: "Admin" },
        { id: 2, name: "Marc Leroy", email: "marc@example.com", role: "Membre" },
        { id: 3, name: "Ismail ", email: "ismail@example.com", role: "Manager" },
      ];
      const found = mockPeople.find((p) => p.id === id) || null;
      setPerson(found);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) return <DashboardLoading/>;
  if (!person) return <p className="p-5 text-red-500">Aucune personne trouvée.</p>;

  return (
    <div className="max-w-md mx-auto p-5 border rounded-lg shadow-md bg-white">
      <h1 className="text-2xl font-bold mb-4">Détails de la personne</h1>
      <p><strong>Nom :</strong> {person.name}</p>
      <p><strong>Email :</strong> {person.email}</p>
      <p><strong>Rôle :</strong> {person.role}</p>
    </div>
  );
}
