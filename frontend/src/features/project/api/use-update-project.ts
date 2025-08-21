import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import z from "zod";
import { projectSchema } from "../schemas";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

export const useUpdateProject = (projectId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof projectSchema>) => {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${baseURL}/api/projects/${projectId}`,
        values,
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
      toast.success(data.message || "Projet mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
    onError: (error: any) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Erreur serveur lors de la mise à jour du projet.";
      toast.error(message);
    },
  });
};
