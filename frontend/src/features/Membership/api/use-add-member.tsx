import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { addMemberSchema } from "../schemas";

// Base URL (configurable via .env)
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

export const useAddMemberToOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      values: z.infer<typeof addMemberSchema>
    ): Promise<any> => {
      const token = localStorage.getItem("token");

      const response = await axios.post(`${baseURL}/api/memberships/add`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Membre ajouté avec succès");
      queryClient.invalidateQueries({ queryKey: ["organization-members"] });
        queryClient.invalidateQueries({ queryKey: ["workspaces"] }); // refetch workspaces
      
    },

    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 404) {
          toast.error(message || "Utilisateur ou organisation introuvable.");
        } else if (status === 409) {
          toast.warning(message || "Cet utilisateur est déjà membre.");
        } else {
          toast.error(message || "Une erreur est survenue lors de l'ajout du membre.");
        }
      } else {
        toast.error("Erreur inattendue.");
      }
    },
  });
};
