import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";
import React from "react";

const DashboardLoading = () => {
  return (
    // <div className="min-h-screen flex items-center justify-center">
    // 	<Loader className="animate-spin size-6 text-muted-foreground" />
    // </div>
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-full rounded-xl" />{" "}
          {/* image / bloc principal */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-[80%]" /> {/* titre */}
            <Skeleton className="h-4 w-[60%]" /> {/* sous-titre */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardLoading;
