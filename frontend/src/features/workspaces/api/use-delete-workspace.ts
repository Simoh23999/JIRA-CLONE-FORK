"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

// Fonction pour supprimer une organisation
const deleteOrganization = async (id: number): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token d'authentification manquant.");
      return false;
    }

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";
    const url = `${BASE_URL}/organizations/${id}`;

    const res = await axios.delete(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      toast.success(res.data.message || "Organisation supprimée avec succès");
      return res.data;
    } else {
      toast.error("Échec de la suppression de l'organisation.");
      return false;
    }
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      (err instanceof Error ? err.message : "Une erreur inconnue s'est produite.");
    toast.error(message);
    return false;
  }
};

// Hook React Query pour utiliser la suppression
export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: number) => deleteOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      router.push("/dashboard/organisations");
    },
  });
};
