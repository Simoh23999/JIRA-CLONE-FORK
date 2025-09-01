"use client";

import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { JwtPayload } from "@/types/jwt";
import { refreshToken } from "@/lib/refreshToken";
import { jwtDecode } from "jwt-decode";
import { Task } from "@/types/task";

export interface Sprint {
  id: string|number;
  name: string;
    // status: "Actif" | "Planification" | "Terminé" | "Fermé";
  status: "PLANNED"|"ACTIVE"|"COMPLETED"|"CANCELLED";
  startDate: string;
  endDate: string;
  progress?: number;
  tasks?: {
    completed: number;
    total: number;
  };
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

export function useGetTasksByTask(projectId: number | string) {
  return useQuery<Task[], Error>({
    queryKey: ["tasks", "project", projectId],      
    queryFn: async () => {
      try {
       const storedToken = 
        localStorage.getItem("token") || sessionStorage.getItem("token");
        let token = storedToken;
        const response = await axios.get(
          `${baseURL}/api/projects/${projectId}/sprintActif`,
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
      });
    }

export function useGetSprintsByProjectId(projectId: string | number) {
  return useQuery<Sprint[], Error>({
    queryKey: ["sprints", projectId],
    queryFn: async () => {
      try {
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
        const response = await axios.get(
          `${baseURL}/api/sprints/project/${projectId}`,
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
          "Une erreur est survenue.";
        throw new Error(msg);
      }
    },
    enabled: Boolean(projectId),
  });
}
