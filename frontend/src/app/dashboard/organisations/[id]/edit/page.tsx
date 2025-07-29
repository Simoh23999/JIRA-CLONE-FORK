"use client";

import { useParams } from "next/navigation";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import DashboardLoading from "@/app/dashboard/loading";

export default function EditWorkspacePage() {
  const params = useParams();
  const id = Number(params.id);
  const { workspace, loading, error } = useGetWorkspace(id);

  if (loading) return <DashboardLoading />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 max-w-4xl">
    </div>
  );
}
