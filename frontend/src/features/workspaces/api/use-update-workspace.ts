import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Organization } from "@/components/organisation/types";
import { useParams } from "next/navigation";
import { JwtPayload } from "@/types/jwt";
import { refreshToken } from "@/lib/refreshToken";
import { jwtDecode } from "jwt-decode";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      workspaceId,
      updatedData,
    }: {
      workspaceId: number | string;
      updatedData: Partial<Organization>;
    }) => {
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
      const url = `${baseURL}/organizations/${workspaceId}`;
      const response = await axios.put(url, updatedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Organisation mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] }); // refetch
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || err.message || "Erreur inconnue.";
      toast.error(msg);
    },
  });
};
