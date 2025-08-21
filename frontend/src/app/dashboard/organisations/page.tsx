"use client";

import React, { useEffect, useState } from "react";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import DashboardLoading from "../loading";
import CardOrganization from "@/components/organisation/CardOrganization";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Aperture } from "lucide-react";

export default function ProjectsList() {
  const { data: workspaces, isLoading, isError, error } = useGetWorkspaces();

  if (isLoading) return <DashboardLoading />;
  if (error) return <p className="text-center p-8 text-red-600">{isError}</p>;

  return (
    <div>
      <Label className="text-2xl font-bold text-[#24527a] flex items-center gap-2 mb-6">
        Liste des organisations
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {workspaces?.map((org) => (
          <CardOrganization key={org.id} org={org} />
        ))}
      </div>
    </div>
  );
}
