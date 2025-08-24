import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Member,
  Organization,
  Organizer,
} from "@/components/organisation/types";
import { useGetOrganizationMembers } from "./use-get-workspace";
import { JwtPayload } from "@/types/jwt";
import { refreshToken } from "@/lib/refreshToken";
import { jwtDecode } from "jwt-decode";
const fetchWorkspaces = async (): Promise<Organization[]> => {
  const url = `http://localhost:9090/api/me/organizations`;
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

  const orgRes = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const organizations = orgRes.data;

  const result: Organization[] = await Promise.all(
    organizations.map(async (org: any) => {
      try {
        const membersData = await useGetOrganizationMembers(org.id);
        const owner = membersData.data?.find(
          (member: Member) => member.username === org.ownerUsername,
        );

        const organizer: Organizer = {
          id: owner?.userId || 0,
          fullName: owner?.fullName || org.ownerUsername || "Inconnu",
          avatarUrl:
            owner?.avatarUrl || `https://i.pravatar.cc/100?u=${owner?.userId}`,
        };

        return {
          id: org.id,
          name: org.name,
          description: org.description,
          organizer,
        };
      } catch (e) {
        return {
          id: org.id,
          name: org.name,
          description: org.description,
          organizer: {
            id: org.id,
            fullName: org.ownerUsername,
          },
        };
      }
    }),
  );

  return result;
};

export const useGetWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: fetchWorkspaces,
    staleTime: 5 * 60 * 1000, // cache valide 5 minutes
  });
};
