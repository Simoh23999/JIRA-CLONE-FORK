"use client";

import * as React from "react";
import {
  Building,
  CheckCircle,
  Frame,
  Group,
  Home,
  Settings2,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/dist/server/api-utils";
import router, { useRouter } from "next/router";

// Définir le type du contenu du token
type JwtPayload = {
  name: string;
  email: string;
  exp?: number;
};

export function AppSidebarV2(props: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "Utilisateur",
    email: "non défini",
    avatar: "/avatars/avatar.jpg",
  });

  React.useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn(
          "Aucun token trouvé, redirection vers la page de connexion",
        );
        router.push("/auth");
        return;
      }
      if (token) {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          console.warn("Token expiré");
          localStorage.removeItem("token");
          sessionStorage.removeItem("token")
          // Rediriger vers la page de connexion
          router.push("/auth");
        } else {
          setUser((prev) => ({
            ...prev,
            name: decoded.name,
            email: decoded.email,
          }));
        }
      }
    } catch (err) {
      console.error("Erreur lors du décodage du token :", err);
    }
  }, []);


const data = {
  user,
  teams: [
    { name: "DEVPFA-SQUAD1", logo: Group, plan: "Amina" },
    { name: "team1234", logo: Group, plan: "Mohamed" },
  ],
  navMain: [
    { title: "Accueil", url: "/", icon: Home, isActive: false, items: [] },
    {
      title: "Organisations",
      url: "/organisations",
      icon: Building,
      isActive: false,
      items: [],
    },
    {
      title: "Mes tâches",
      url: "/tasks",
      icon: CheckCircle,
      isActive: false,
      items: [],
    },
    {
      title: "Membres",
      url: "/members",
      icon: Users,
      isActive: false,
      items: [],
    },
    { title: "Paramètres", url: "/settings", icon: Settings2, isActive: false },
  ],
  projects: [{ name: "Clone Jira", url: "#", icon: Frame }],
};

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center py-4">
          <Image src="/logo.svg" alt="logo" width={120} height={40} />
        </div>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
