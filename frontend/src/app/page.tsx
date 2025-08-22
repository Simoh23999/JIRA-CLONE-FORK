"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      // Pas de token → redirection vers page de connexion
      router.push("/auth");
    } else {
      // Token présent → redirection vers dashboard
      router.push("/dashboard");
    }
  }, [router]);

  return <RequireAuth> </RequireAuth>; // Ou un loader si tu veux afficher un truc pendant la redirection
};

export default HomePage;
