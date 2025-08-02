"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Organization } from "../types";

export default function CardOrganizer({ org }: { org: Organization }) {
  return (
    <div className="mt-2">
      <p className="text-xs font-medium text-gray-700">Organizer</p>
      <Link
        href={`/dashboard/people/${org.organizer?.id}`}
        className="flex items-center space-x-2 mt-1"
      >
        <Avatar className="h-7 w-7 rounded-lg">
          <AvatarImage
            src={org.organizer?.avatarUrl}
            alt={org.organizer?.fullName}
          />
          <AvatarFallback className="rounded-lg">
            {org.organizer?.fullName?.[0] || "O"}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-gray-600">
          {org?.organizer?.fullName || "No Organizer"}
        </span>
      </Link>
    </div>
  );
}
