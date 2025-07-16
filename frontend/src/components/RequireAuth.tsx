"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import IntroLoader from "./IntroLoader";

type Props = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const token2 = sessionStorage.getItem("token");

    if (!token && !token2) {
      router.push("/auth");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* <Loader className="animate-spin size-6 text-muted-foreground" /> */}
        <IntroLoader />
      </div>
    );
  }

  return <>{children}</>;
}
