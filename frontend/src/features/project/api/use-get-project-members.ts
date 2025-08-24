import { ProjectMember } from "@/types/PRojectMember";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { JwtPayload } from "@/types/jwt";
import { refreshToken } from "@/lib/refreshToken";
import { jwtDecode } from "jwt-decode";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
// Get MEMBERS of organization
export const useGetProjectMembers = (id: number | string) => {
  return useQuery<ProjectMember[]>({
    queryKey: ["project-members"],
    queryFn: async () => {
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
        `${baseURL}/api/projects/${id}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(
        "membres :          <<<<<<<<<<<<<<<<<<",
        response.data.members,
      );
      return response.data.members;
    },
    enabled: !!id,
  });
};
