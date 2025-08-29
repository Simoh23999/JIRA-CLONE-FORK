"use client"

// Obtenir le nombre total de tâches pour un ensemble de projets
export function useGetTotalTasksByProjects(projectIds: Array<number | string>) {
  return useQuery<number, Error>({
    queryKey: ["tasks", "total", projectIds],
    queryFn: async () => {
      try {
        const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
        let token = storedToken;
        let total = 0;
        // Appel en parallèle pour chaque projet
        const results = await Promise.all(
          projectIds.map(async (projectId) => {
            const response = await axios.get(
              `${baseURL}/api/projects/${projectId}/tasks`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return Array.isArray(response.data) ? response.data.length : 0;
          })
        );
        total = results.reduce((acc, curr) => acc + curr, 0);
        return total;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        const msg =
          axiosErr.response?.data?.message ||
          axiosErr.message ||
          "Une erreur est survenue lors du comptage des tâches.";
        throw new Error(msg);
      }
    },
    enabled: Array.isArray(projectIds) && projectIds.length > 0,
    staleTime: 1000 * 60, // 1 minute
  });
}


import { Task } from "@/types/task";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";


export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

// Hook to get all tasks for a project
export function useGetTasksByProject(projectId: number | string) {
  return useQuery<Task[], Error>({
    queryKey: ["tasks", "project", projectId],
    queryFn: async () => {
      try {
       const storedToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");
        let token = storedToken;
        const response = await axios.get(
          `${baseURL}/api/projects/${projectId}/tasks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        const msg =
          axiosErr.response?.data?.message ||
          axiosErr.message ||
          "Une erreur est survenue lors de la récupération des tâches.";
        throw new Error(msg);
      }
    },
    enabled: Boolean(projectId),
    staleTime: 1000 * 60, // 1 minute
  });
}

// Hook to get a specific task by ID
export function useGetTaskById(taskId: number | string) {
  return useQuery<Task, Error>({
    queryKey: ["tasks", taskId],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${baseURL}/api/tasks/${taskId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        const msg =
          axiosErr.response?.data?.message ||
          axiosErr.message ||
          "Une erreur est survenue lors de la récupération de la tâche.";
        throw new Error(msg);
      }
    },
    enabled: Boolean(taskId),
  });
}