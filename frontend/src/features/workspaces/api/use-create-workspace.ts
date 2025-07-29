import z from "zod";
import { createWorkSpaceSchema } from "../schemas";
import { toast } from "sonner";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

export const useCreateWorkspace = (
  values: z.infer<typeof createWorkSpaceSchema>
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `${baseURL}/organizations`;
      const token = localStorage.getItem("token");

      const response = await axios.post(url, values, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const { message } = response.data;
      toast.success(message || "Organisation créée avec succès");
      resolve();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;

        toast.error(backendMessage || "Erreur serveur lors de la création de l'organisation.");
        reject(new Error(backendMessage || "Erreur serveur"));
      } else {
        toast.error("Une erreur inconnue est survenue.");
        reject(error);
      }
    }
  });
};
