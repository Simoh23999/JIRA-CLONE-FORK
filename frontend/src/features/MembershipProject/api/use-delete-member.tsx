import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { JwtPayload } from "@/types/jwt";
import { refreshToken } from "@/lib/refreshToken";
import { jwtDecode } from "jwt-decode";
// Base URL (configurable via .env)
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

interface DeleteMemberPayload {
  projectMembershipId: number | string;
}

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: DeleteMemberPayload): Promise<any> => {
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

      const response = await axios.delete(
        `${baseURL}/api/projects/members/${values.projectMembershipId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Membre supprimé avec succès");
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
          toast.error(message || "Erreur lors de la suppression du membre.");
        }
      } else {
        toast.error("Erreur inattendue.");
      }
    },
  });
};
