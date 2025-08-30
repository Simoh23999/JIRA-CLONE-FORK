import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import z from "zod";
import { createTaskSchema } from "../schemas"; 

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    // values = données du formulaire (title, description, sprintId, etc.)
    // taskId = identifiant de la tâche à modifier
    mutationFn: async ({
      taskId,
      values,
    }: {
      taskId: number | string;
      values: z.infer<typeof createTaskSchema>; 
    }) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `${baseURL}/api/tasks/${taskId}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        const msg =
          axiosErr.response?.data?.message ||
          axiosErr.message ||
          "Une erreur est survenue lors de la mise à jour de la tâche.";
        throw new Error(msg);
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", "project", data.projectId], 
      });
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });
    },
  });
}
