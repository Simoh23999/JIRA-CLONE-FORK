"use client";

import { Fragment, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import RequireAuth from "@/components/RequireAuth";
import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function formatPath(path: string) {
  return path
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const { data: workspaces, isLoading, isError, error } = useGetWorkspaces();

  const currentPage =
    segments.length > 1
      ? formatPath(segments[segments.length - 1])
      : "Dashboard";

  const [open, setOpen] = useState(false);
  const canClose = !!(workspaces && workspaces.length > 0);
  useEffect(() => {
    if (!isLoading && (!workspaces || workspaces.length === 0)) {
      setOpen(true);
    }
  }, [isLoading, workspaces]);

  return (
    <RequireAuth>
      <CreateWorkspaceModal
        open={open}
        onOpenChange={setOpen}
        canClose={canClose}
      />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />

                  {segments.length > 2 &&
                    segments.slice(1, -1).map((segment, index) => (
                      <Fragment key={index}>
                        <BreadcrumbItem>
                          <BreadcrumbLink
                            href={`/${segments.slice(0, index + 2).join("/")}`}
                          >
                            {formatPath(segment)}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                      </Fragment>
                    ))}

                  {segments.length > 1 && (
                    <BreadcrumbItem>
                      <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                    </BreadcrumbItem>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <main className="flex-1 p-4 pt-0">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </RequireAuth>
  );
}
