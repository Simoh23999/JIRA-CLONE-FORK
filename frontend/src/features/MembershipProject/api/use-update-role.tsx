// api/projects/members/{projectMembershipId}/role?newRole={role}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { UpdateMemberRolePayload } from "../schemas";

// Base URL (configurable via .env)
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

export const useUpdateMemberProjectRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      values: z.infer<typeof UpdateMemberRolePayload>,
    ): Promise<any> => {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${baseURL}/api/projects/members/${values.projectMembershipId}/role?newRole=${values.newRole}`,
        null, // body JSON
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Rôle mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["project-members"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },

    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 403) {
          toast.error(message || "Vous n'avez pas la permission.");
        } else if (status === 404) {
          toast.error(message || "Membre ou organisation introuvable.");
        } else {
          toast.error(message || "Erreur lors de la mise à jour du rôle.");
        }
      } else {
        toast.error("Erreur inattendue.");
      }
    },
  });
};
