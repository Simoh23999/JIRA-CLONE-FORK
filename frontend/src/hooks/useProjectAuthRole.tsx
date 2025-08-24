"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ProjectMember } from "@/types/PRojectMember";
import { useGetProjectMembers } from "@/features/project/api/use-get-project-members";

type JwtPayload = {
  roles: string;
  username: string;
  email: string;
  exp: number;
  sub: string;
  iat: number;
};

export function useProjectAuthRole(projectId: number | string) {
  const [isProjectOwner, setIsProjectOwner] = useState(false);
  const [isProjectMember, setIsProjectMember] = useState(false);
  const [userProjectMembershipId, setUserProjectMembershipId] = useState<
    string | number | null
  >(null);
  const router = useRouter();
  const { data: projectMembers } = useGetProjectMembers(projectId);
  console.log("project id  members ====", projectMembers);
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    if (token && projectMembers) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log("============== > decoded : ", decoded);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          console.warn("Token expiré");
          localStorage.removeItem("token");
          router.push("/auth");
        } else {
          const email = decoded.email;
          const member = projectMembers.find((m) => m.email === email);
          console.log("=========> membre : ", member);
          console.log("======> email :", email);
          if (member) {
            setUserProjectMembershipId(member.id);
            setIsProjectMember(
              member.roleInProject === "PROJECT_MEMBER" ||
                member.roleInProject === "PROJECT_OWNER",
            );
            setIsProjectOwner(member.roleInProject === "PROJECT_OWNER");
          } else {
            setUserProjectMembershipId(1222);
          }
        }
      } catch (err) {
        console.error("Erreur lors du décodage du token", err);
        router.push("/auth");
      }
    }
  }, [projectMembers, router]);

  return { isProjectOwner, isProjectMember, userProjectMembershipId };
}
