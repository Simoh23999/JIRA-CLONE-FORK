"use client";

import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

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
  const [user, setUser] = useState({
    name: "Utilisateur",
    email: "non défini",
    avatar: "/avatars/avatar.jpg",
  });
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.push("/auth");
      } else {
        setUser((prev) => ({
          ...prev,
          name: decoded.username,
          email: decoded.email,
        }));
      }
    } catch (err) {
      console.error("Erreur lors du décodage du token :", err);
    }
  }, [router]);

  const data = {
    user,
    teams: [
      { name: "DEVPFA-SQUAD1", logo: Group, plan: "Amina" },
      { name: "team1234", logo: Group, plan: "mohamed" },
    ],
    navMain: [
      { title: "Home", url: "/", icon: Home, isActive: false, items: [] },
      {
        title: "Organisations",
        url: "/organisations",
        icon: Building,
        isActive: false,
        items: [],
      },
      {
        title: "My Tasks",
        url: "/tasks",
        icon: CheckCircle,
        isActive: false,
        items: [],
      },
      {
        title: "Members",
        url: "/members",
        icon: Users,
        isActive: false,
        items: [],
      },
      { title: "Settings", url: "/settings", icon: Settings2, isActive: false },
    ],
    projects: [{ name: "jira clone", url: "#", icon: Frame }],
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
              src="/TaskFlow.mp4"
              className="w-20  à h-10 object-cover rounded-full transition-all duration-300"
              muted
              autoPlay
              loop
              playsInline
            />
          ) : (
            <Image
              src="/TaskFlow.png"
              alt="logo"
              width={40}
              height={90}
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
