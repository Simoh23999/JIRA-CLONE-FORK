"use client";

import React from "react";
import { Building2, User } from "lucide-react";
import { Organization } from "../types";
import { useGetOrganizationMembers } from "@/features/workspaces/api/use-get-workspace";

export default function CardHeader({ org }: { org: Organization }) {
   const { data: members} = useGetOrganizationMembers(org.id);
  return (
    <div className="flex items-center space-x-3 mb-2">
      {org.avatarUrl ? (
        <img
          src={org.avatarUrl}
          alt={org.name}
          className="w-6 h-6 rounded-full border border-gray-300"
        />
      ) : (
        <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 bg-gray-100">
          <Building2 className="w-4 h-4 text-gray-500" />
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">
          {org.name}
        </h2>
        <p className="text-xs text-gray-500">
          {org.description || "No description"}
        </p>
      </div>
       {/* nombre de membres */}
       <div className="flex items-center space-x-1 ml-auto">
        <User className="inline-block w-3 h-3  text-gray-400" />
        <span className="text-sm font-medium text-gray-400">{members?.length}</span>
      </div>
    </div>
  );
}
