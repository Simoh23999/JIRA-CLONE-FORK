"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { JSX, SVGProps } from "react";
import Link from "next/link";
import { useGetWorkspaces } from "../api/use-get-workspaces";

export default function SearchUi() {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const { data: workspaces, isLoading, isError, error } = useGetWorkspaces();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFilteredResults([]);
      return;
    }

    // Filtrer la liste selon la query
    const filtered =
      workspaces?.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase()),
      ) || [];

    setFilteredResults(filtered);
  };

  const handleSelect = (itemName: string) => {
    setQuery(itemName);
    setFilteredResults([]);
  };

  return (
    <div className="relative w-full pb-3 max-w-md">
      <Input
        type="search"
        placeholder="Rechercher..."
        className="pl-8 border border-gray-300 shadow-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 w-full"
        value={query}
        onChange={handleChange}
        autoComplete="off"
      />
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 pointer-events-none opacity-50" />

      {/* Liste des résultats */}
      {filteredResults.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredResults.map((item) => (
            <li
              key={item.id}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              onClick={() => handleSelect(item.name)}
            >
              <Link href={`/dashboard/organisations/${item.id}`}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
