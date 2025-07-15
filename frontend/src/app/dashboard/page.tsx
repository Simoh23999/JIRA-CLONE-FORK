"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth"); // pas connecté → redirection vers auth
    }
  }, [router]);

  return (
    <div>
      <RequireAuth>
        <h1 className="text-xl font-semibold">Welcome to the Dashboard</h1>
      </RequireAuth>
    </div>
  );
}
