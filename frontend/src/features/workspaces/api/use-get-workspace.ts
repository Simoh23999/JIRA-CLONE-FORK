import { Organization } from "@/components/organisation/types";
import { useGetWorkspaces } from "./use-get-workspaces";
import { useState, useEffect } from "react";
import axios from "axios";
import { Member } from "@/components/organisation/types";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const useGetMembers = (id: string | number) => {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [loadingM, setLoadingM] = useState(true);
  const [errorM, setErrorM] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      console.warn("Aucun ID d'organisation fourni !");
      return;
    }

    const fetchMembers = async () => {
      console.log("Chargement des membres pour l'organisation :", id);
      setLoadingM(true);
      setErrorM(null);

      try {
        const url = `${baseURL}/api/organizations/${id}/members`;
        const token = localStorage.getItem("token");
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        setMembers(response.data.members); 

      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          setErrorM(err.response?.data?.message || err.message);
        } else {
          setErrorM("Erreur inconnue lors du chargement des membres");
        }
      } finally {
        setLoadingM(false);
      }
    };

    fetchMembers();
  }, [id]);

  return { members, loadingM, errorM };
};


export const useGetWorkspace = (id: string | number) => {
  const { workspaces, loading: loadingWorkspaces, error: errorWorkspaces } = useGetWorkspaces();
  const [workspace, setWorkspace] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaces) return;

    setLoading(true);
    setError(null);

    const found = workspaces.find((w) => w.id === id);
    if (found) {
      setWorkspace(found);
      setLoading(false);
    } else {
      setError("Organisation introuvable");
      setLoading(false);
    }
  }, [id, workspaces]);

  return {
    workspace,
    loading: loading || loadingWorkspaces,
    error: error || errorWorkspaces,
  };
};
