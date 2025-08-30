"use client";

import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Project } from "@/types/project";
import { JwtPayload } from "@/types/jwt";
import { refreshToken } from "@/lib/refreshToken";
import { jwtDecode } from "jwt-decode";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

export function useGetProjectById(projectid: number | string) {
  return useQuery<Project, Error>({
    queryKey: ["projects", projectid],
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
          `${baseURL}/api/projects/${projectid}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        return response.data.project;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        const msg =
          axiosErr.response?.data?.message ||
          axiosErr.message ||
          "Une erreur est survenue.";
        throw new Error(msg);
      }
    },
    enabled: Boolean(projectid),
  });
}

export function useGetProjects(workspaceId: string |number) {
  return useQuery<Project[], Error>({
    queryKey: ["projects", workspaceId],
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
          `${baseURL}/api/projects/organizations/${workspaceId}/projects`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        return response.data.projects;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        const msg =
          axiosErr.response?.data?.message ||
          axiosErr.message ||
          "Une erreur est survenue.";
        throw new Error(msg);
      }
    },
    staleTime: 1000 * 60,
  });
}
