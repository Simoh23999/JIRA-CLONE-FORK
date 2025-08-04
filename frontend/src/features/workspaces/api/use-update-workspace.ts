import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Organization } from "@/components/organisation/types";
import { useParams } from "next/navigation";

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
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
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
