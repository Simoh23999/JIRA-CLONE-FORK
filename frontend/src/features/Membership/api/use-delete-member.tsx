import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

// Base URL (configurable via .env)
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

interface DeleteMemberPayload {
  organizationId: string | number;
  targetUserId: string | number;
}

export const useDeleteMemberFromOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ organizationId, targetUserId }: DeleteMemberPayload): Promise<any> => {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${baseURL}/api/organizations/${organizationId}/members/${targetUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Membre supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["organization-members"] });
        queryClient.invalidateQueries({ queryKey: ["workspaces"] }); // refetch workspaces
        
    },

    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 404) {
          toast.error(message || "Membre ou organisation introuvable.");
        } else if (status === 403) {
          toast.error(message || "Action non autorisée.");
        } else {
          toast.error(message || "Erreur lors de la suppression du membre.");
        }
      } else {
        toast.error("Erreur inattendue.");
      }
    },
  });
};
