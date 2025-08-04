import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Organization, Member } from "@/components/organisation/types";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// 🔹 Get ONE organization by ID
export const useGetOrganization = (id: number | string) => {
  return useQuery<Organization>({
    queryKey: ["workspaces", id],
    queryFn: async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get(`${baseURL}/organizations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!id, // only run if id is truthy
  });
};

// 🔹 Get MEMBERS of organization
export const useGetOrganizationMembers = (id: number | string) => {
  return useQuery<Member[]>({
    queryKey: ["organization-members", id],
    queryFn: async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get(`${baseURL}/api/organizations/${id}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.members;
    },
    enabled: !!id,
  });
};
