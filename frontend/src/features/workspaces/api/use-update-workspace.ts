"use client";

import { useState } from "react";
import axios from "axios";
import { Organization } from "@/components/organisation/types";
import { toast } from "sonner";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const useUpdateWorkspace = (initialData: Organization[]) => {
  const [workspaces, setWorkspaces] = useState<Organization[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateWorkspace = async (
    workspaceId: string | number,
    updatedData: Partial<Organization>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const url = `${baseURL}/organizations/${workspaceId}`; 
      const response = await axios.put(
        url,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      
      const updatedWorkspace = response.data;
      ///////
      setWorkspaces((prev) =>
        prev.map((w) => (w.id === workspaceId ? updatedWorkspace : w))
      );
      toast.success(response.data.message || "Organisation mise à jour avec succès");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erreur lors de la mise à jour";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { workspaces, updateWorkspace, loading, error };
};
