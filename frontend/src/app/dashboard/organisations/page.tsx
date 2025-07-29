"use client";

import React, { useState } from "react";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import DashboardLoading from "../loading";
import CardOrganization from "@/components/organisation/CardOrganization";
import { Label } from "@radix-ui/react-dropdown-menu";

export default function ProjectsList() {
  const { workspaces, loading, error } = useGetWorkspaces();

  
  if (loading) return <DashboardLoading />;
  if (error) return <p className="text-center p-8 text-red-600">{error}</p>;



  return (
    <div>
    <Label className="text-2xl font-bold text-orange-400 flex items-center gap-2 mb-6">
        Workspace List
      </Label>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {workspaces?.map((org) => (
        <CardOrganization key={org.id} org={org} />
      ))}
    </div>
    </div>
  );
}
