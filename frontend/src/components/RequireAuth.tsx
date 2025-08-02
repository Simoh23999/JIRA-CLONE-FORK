"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import IntroLoader from "./IntroLoader";
import { jwtDecode, JwtPayload } from "jwt-decode";
import VideoIntro from "./VideoIntro";

type Props = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

   try {

  if (token) {
    // Vérifier le format du token (3 parties séparées par des points)
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("Format de token invalide");
      localStorage.removeItem("token");
      router.push("/auth");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.warn("Token expiré");
        localStorage.removeItem("token");
        router.push("/auth");
      } else {
         // setUser((prev) => ({
          //   ...prev,
          //   username: decoded.username,
          //   email: decoded.email,
          // }));
        setLoading(false);
      }
    } catch (decodeError) {
      console.error("Erreur lors du décodage du token :", decodeError);
      localStorage.removeItem("token");
      router.push("/auth");
    }
  }
} catch (err) {
  console.error("Erreur inattendue :", err);
}






    // if (!token) {
    //   router.push("/auth");
    // } else {
    //   setLoading(false);
    // }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* <Loader className="animate-spin size-6 text-muted-foreground" /> */}
        {/* <IntroLoader /> */}
        <VideoIntro onFinished={() => setLoading(false)} />
      </div>
    );
  }


  
  return <>{children}</>;
}
