import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

export function useAssignTask() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { taskId: number |string ; assigneeProjectMembershipId: number }>({
    mutationFn: async ({ taskId, assigneeProjectMembershipId }) => {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `${baseURL}/api/tasks/${taskId}/assign?assigneeProjectMembershipId=${assigneeProjectMembershipId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        const msg =
          axiosErr.response?.data?.message ||
          axiosErr.message ||
          "Une erreur est survenue lors de l'assignation de la tâche.";
        throw new Error(msg);
      }
    },
    onSuccess: (_, { taskId }) => {
      // Invalidate specific task and all project tasks
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "project"] });
    },
  });
}
