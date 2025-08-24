import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import z from "zod";
import { createWorkSpaceSchema } from "../schemas";
import { JwtPayload } from "@/types/jwt";
import { refreshToken } from "@/lib/refreshToken";
import { jwtDecode } from "jwt-decode";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof createWorkSpaceSchema>) => {
      const storedToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      let token = storedToken;
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);

          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            token = await refreshToken();
          }
        } catch (error) {
          console.error("Invalid token:", error);
          token = await refreshToken();
        }
      } else {
        token = await refreshToken();
      }
      const response = await axios.post(`${baseURL}/organizations`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Organisation créée avec succès");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (error: any) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Erreur serveur lors de la création de l'organisation.";
      toast.error(message);
    },
  });
};
