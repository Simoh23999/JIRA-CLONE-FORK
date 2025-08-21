import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { addProjectMemberSchema } from "../schemas";
// import { useUpdateMemberProjectRole } from "./use-update-role";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080";

export const useAddMemberToProject = () => {
  const queryClient = useQueryClient();
  // const updateMemberProjectRole = useUpdateMemberProjectRole();

  return useMutation({
    mutationFn: async (
      values: z.infer<typeof addProjectMemberSchema>,
    ): Promise<any> => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token JWT manquant");

      // On utilise l'API backend : POST /api/projects/{projectId}/members?membershipId=...
      const response = await axios.post(
        `${baseURL}/api/projects/${values.projectId}/members`,
        null, // pas de body, params dans l'URL
        {
          params: { membershipId: values.membershipId },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // if(values.role=="PROJECT_OWNER"){
      //    updateMemberProjectRole.mutate({
      //       projectMembershipId: values.membershipId,
      //       newRole: "PROJECT_OWNER",
      //     });
      // }
      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Membre ajouté avec succès");
      // Rafraîchir la liste des membres du projet
      queryClient.invalidateQueries({ queryKey: ["project-members"] });
    },

    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 404) {
          toast.error(message || "Projet ou utilisateur introuvable.");
        } else if (status === 409) {
          toast.warning(message || "Cet utilisateur est déjà membre.");
        } else {
          toast.error(
            message || "Une erreur est survenue lors de l'ajout du membre.",
          );
        }
      } else {
        toast.error("Erreur inattendue.");
      }
    },
  });
};
