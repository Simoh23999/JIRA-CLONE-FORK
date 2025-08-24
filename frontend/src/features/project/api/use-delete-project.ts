import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { JwtPayload } from "@/types/jwt";
import { refreshToken } from "@/lib/refreshToken";
import { jwtDecode } from "jwt-decode";
// Base URL (configurable via .env)
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

interface DeleteProjectPayload {
  projectId: string | number;
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: DeleteProjectPayload): Promise<any> => {
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
