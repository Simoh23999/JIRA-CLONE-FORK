"use client";

import { useEffect, useRef, useState } from "react";
import {
  Building,
  CheckCircle,
  Frame,
  Group,
  Home,
  Settings2,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { OrganizationSwitcher } from "./workspace-switcher";
import { useOrganization } from "@/app/context/OrganizationContext";
import { useGetProjects } from "@/features/project/api/use-get-project";
import { Organization } from "./organisation/types";
import { Project } from "@/types/project";

type JwtPayload = {
  email: string;
  exp: number;
  iat: number;
  roles: string[];
  sub: string;
  username: string;
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [user, setUser] = useState({
    name: "Utilisateur",
    email: "non défini",
    avatar: "/avatars/avatar.jpg",
  });

  // Organisation sélectionnée depuis le contexte
  const { organization, setOrganization } = useOrganization();
  const workspaceId = organization?.id || "87"; // valeur par défaut

  // Hook pour récupérer les projets de l'organisation
  const { data: projects } = useGetProjects(workspaceId);

  // Gestion du changement d'organisation
  const handleOrganizationChange = (org: Organization | null) => {
    setOrganization(org);
    console.log("Organisation sélectionnée :", org);
  };

  // Vérification du token et récupération des infos utilisateur
  useEffect(() => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return router.push("/auth");

      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.push("/auth");
      } else {
        setUser((prev) => ({
          ...prev,
          username: decoded.username,
          email: decoded.email,
        }));
      }
    } catch (err) {
      console.error("Erreur lors du décodage du token :", err);
    }
  }, [router]);

  // Lecture de la vidéo au hover
  useEffect(() => {
    if (isHovered && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) playPromise.catch(console.warn);
    }
  }, [isHovered]);

  // Transformation des projets pour le sidebar
  const sidebarProjects = (projects ?? []).map((p: Project) => ({
    ...p,
    icon: Frame,
    url: `/dashboard/projects/${p.id}`,
  }));

  const data = {
    user,
    navMain: [
      { title: "Accueil", url: "/", icon: Home, isActive: pathname === "/", items: [] },
      { title: "Organisations", url: "/organisations", icon: Building, isActive: false, items: [] },
      { title: "Mes Tâches", url: "/tasks", icon: CheckCircle, isActive: false, items: [] },
      { title: "Membres", url: "/members", icon: Users, isActive: false, items: [] },
      { title: "Paramètres", url: "/settings", icon: Settings2, isActive: false },
    ],
    projects: sidebarProjects,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {state === "collapsed" ? (
          <Image src="/TaskFlowicon.png" alt="logo" width={35} height={35} className="transition-all duration-300" />
        ) : (
          <div
            className="flex items-center justify-center py-1 pr-0 transition-opacity duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHovered ? (
              <video
                ref={videoRef}
                src="/TaskFlow.mp4"
                className="w-20 h-10 object-cover rounded-full transition-all duration-300"
                muted
                loop
                playsInline
              />
            ) : (
              <Image src="/TaskFlow.png" alt="logo" width={85} height={85} className="transition-all duration-300" />
            )}
          </div>
        )}
        <OrganizationSwitcher onOrganizationChange={handleOrganizationChange} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} currentPath={pathname} />
        <NavProjects projects={data.projects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
