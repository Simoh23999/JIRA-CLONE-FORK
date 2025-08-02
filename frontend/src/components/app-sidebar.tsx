"use client";

import { useEffect, useState } from "react";
import {
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
// import { useUser } from "@/app/context/UserContext";

// Définir le type du contenu du token
// type JwtPayload = {
//   name: string;
//   email: string;
//   exp?: number;
// };
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
  // const { user } = useUser();
  const [user, setUser] = useState({
    name: "Utilisateur",
    email: "non défini",
    // avatar: "/avatars/avatar.jpg",
  });
  const router = useRouter();
  const [refreshUser, setRefreshUser] = useState(false);

  useEffect(() => {
    //   const fetchUserData = async () => {
    //   const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    //   if (!token) {
    //     console.warn("Aucun token trouvé, redirection vers la page de connexion");
    //     router.push("/auth");
    //     return;
    //   }

    //   try {
    //     const response = await axios.get("http://localhost:9090/api/me", {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });

    //     const userData = response.data;

    //     setUser({
    //       name: userData.username,
    //       email: userData.email,
    //     });

    //     console.log("Données utilisateur à jour:", userData);
    //   } catch (error) {
    //     console.error("Erreur lors de la récupération des infos utilisateur:", error);
    //     router.push("/auth");
    //   }
    // };

    // fetchUserData();
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      console.log("Token récupéré:", token);
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
          // Rediriger vers la page de connexion
          router.push("/auth");
        } else {
          setUser((prev) => ({
            ...prev,
            name: decoded.username,
            email: decoded.email,
          }));
          console.log("Token valide, utilisateur:", decoded);
        }
      }
    } catch (err) {
      console.error("Erreur lors du décodage du token :", err);
    }
  }, [router, refreshUser]);

  const data = {
    user,
    teams: [
      { name: "DEVPFA-SQUAD1", logo: Group, plan: "Amina" },
      { name: "team1234", logo: Group, plan: "mohamed" },
    ],
    navMain: [
      { title: "Home", url: "/", icon: Home, isActive: false, items: [] },
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
        <div className="flex items-center justify-center py-4">
          <Image src="/logo.svg" alt="logo" width={120} height={40} />
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
