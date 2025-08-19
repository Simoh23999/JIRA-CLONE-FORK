"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { queryClient } from "@/app/ReactQueryProvider";

export function NavUser({
  user,
}: {
  user?: {
    username?: string;
    email?: string;
    avatar?: string;
  };
}) {
  const { isMobile } = useSidebar();

  function Logout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    queryClient.clear();
  }

  // Si pas de user, on peut afficher un placeholder ou rien
  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="p-2 text-sm text-gray-500">Chargement...</div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="p-2">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage src={user.avatar ?? ""} alt={user.username ?? "U"} />
                <AvatarFallback className="rounded-lg">
                  {user.username?.[0] ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.username ?? "Utilisateur"}
                </span>
                <span className="truncate text-xs">{user.email ?? ""}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-lg">
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarImage src={user.avatar ?? ""} alt={user.username ?? "U"} />
                  <AvatarFallback className="rounded-lg">
                    {user.username?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.username ?? "Utilisateur"}
                  </span>
                  <span className="truncate text-xs">{user.email ?? ""}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/dashboard/account">
                <DropdownMenuItem>
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
              </Link>

              <Link href="/dashboard/settings">
                <DropdownMenuItem>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </Link>

              <Link href="/dashboard/notifications">
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => Logout()}>
              <Link href="/auth" className="flex items-center">
                <LogOut className="mr-2 h-4 w-4 text-red-500" />
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
