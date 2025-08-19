import { ProjectMember } from "@/types/PRojectMember";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
// Get MEMBERS of organization
export const useGetProjectMembers = (id: number | string) => {
  return useQuery<ProjectMember[]>({
    queryKey: ["project-members"] ,
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/api/projects/${id}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.members;
      
    },
    enabled: !!id,
  });
};
