"use client";

import React from "react";
import { Organization } from "./types";
import CardHeader from "./ui/CardHeader";
import CardOrganizer from "./ui/CardOrganizer";
import CardFooter from "./ui/CardFooter";
import Link from "next/link";

export default function CardOrganization({ org }: { org: Organization }) {
  return (
    <div className="relative border border-gray-200 rounded-md p-4 shadow-sm bg-white hover:shadow-lg transition-shadow w-full h-auto flex flex-col">
      {/* Left colored bar */}
      <div className="absolute left-0 top-0 h-full w-1 rounded-l-md bg-blue-200 "></div>
   
      <Link
        href={`/dashboard/organisations/${org.id}`}
      >
        <CardHeader org={org} />
      </Link>

      <CardOrganizer org={org} />
       <Link
        href={`/dashboard/organisations/${org.id}`}
      >
      <CardFooter />
      </Link>
    </div>
  );
}
