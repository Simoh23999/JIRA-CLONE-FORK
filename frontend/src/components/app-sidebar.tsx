"use client";

import { useEffect, useRef, useState } from "react";
import {
  Building,
  CheckCircle,
  Frame,
  Group,
  Home,
  Settings2,
  ShoppingCartIcon,
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
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useGetProjects } from "@/features/project/api/use-get-project";
import { Project } from "@/types/project";

import { useAuth } from "@/app/context/UserContext";
// import { useRouter } from "next/navigation";
// import { usePathname } from "next/navigation";
// import { useUser } from "@/app/context/UserContext";

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
  // const [user, setUser] = useState({
  //   name: "Utilisateur",
  //   email: "non défini",
  //   avatar: "/avatars/avatar.jpg",
  // });
  const workspaceId = 87; //// simulation

  // const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { data: projects } = useGetProjects(workspaceId);
  // const projects: Project[] = [];

  // Transformation des projets API → format NavProjects
  const sidebarProjects = (projects ?? []).map((p) => ({
    ...p,
    icon: Frame,
    url: `/dashboard/projects/${p.id}`,
  }));

  // const [user, setUser] = useState({
  //   name: "Utilisateur",
  //   email: "non défini",
  //   avatar: "/avatars/avatar.jpg",
  // });
  const [isHovered, setIsHovered] = useState(false);
  // const router = useRouter();

  const { user, isLoading } = useAuth();
  // useEffect(() => {
  //   try {
  //     const token =
  //       localStorage.getItem("token") || sessionStorage.getItem("token");
  //     if (!token) {
  //       router.push("/auth");
  //       return;
  //     }
  //     const decoded = jwtDecode<JwtPayload>(token);
  //     if (decoded.exp && decoded.exp * 1000 < Date.now()) {
  //       localStorage.removeItem("token");
  //       sessionStorage.removeItem("token")
  //       router.push("/auth");
  //     } else {
  //       setUser((prev) => ({
  //         ...prev,
  //         username: decoded.username,
  //         email: decoded.email,
  //       }));
  //     }
  //   } catch (err) {
  //     console.error("Erreur lors du décodage du token :", err);
  //   }
  // }, [router]);

  // Jouer la vidéo seulement si visible et montée
  useEffect(() => {
    if (isHovered && videoRef.current) {
      const video = videoRef.current;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Erreur lecture vidéo :", err);
        });
      }
    }
  }, [isHovered]);

  console.log("user: ", user);
  const data = {
    user,
    teams: [
      { name: "DEVPFA-SQUAD1", logo: Group, plan: "Amina" },
      { name: "team1234", logo: Group, plan: "mohamed" },
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
        title: "Mes Tâches",
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
      {
        title: "Paramètres",
        url: "/settings",
        icon: Settings2,
        isActive: false,
      },
    ],

    projects: sidebarProjects,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
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
            <Image
              src="/TaskFlow.png"
              alt="logo"
              width={85}
              height={85}
              className="transition-all duration-300"
            />
          )}
        </div>
        <TeamSwitcher teams={data.teams} />
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
