import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

// Base URL (configurable via .env)
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

interface DeleteProjectPayload {
  projectId: string | number;
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: DeleteProjectPayload): Promise<any> => {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${baseURL}/api/projects/${values.projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },

    onSuccess: (data) => {
      // Message succès du backend
      toast.success(data?.message || "Projet supprimé avec succès");
      // Rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },

    onError: (error: any) => {
      // Message d’erreur renvoyé par le backend
      const message =
        error?.response?.data?.message ||
        "Erreur lors de la suppression du projet";
      toast.error(message);
    },
  });
}
