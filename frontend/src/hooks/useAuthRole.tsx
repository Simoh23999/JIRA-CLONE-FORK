"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
// import {JwtPayload} from "@/types/jwt";
import { refreshToken } from "@/lib/refreshToken";

type JwtPayload = {
  roles: string;
  username: string;
  email: string;
  exp: number;
  sub: string;
  iat: number;
};

type Member = {
  userId: string | number;
  email: string;
  role: string;
};

export function useAuthRole(members?: Member[]) {
  const [isAdminOrOwner, setIsAdminOrOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [userId, setUserId] = useState<string | number | null>(null);
  const router = useRouter();

  // useEffect(() => {
  //   const token =
  //     localStorage.getItem("token") || sessionStorage.getItem("token");
  //   if (!token) {
  //     router.push("/auth");
  //     return;
  //   }

  //   if (token && members) {
  //     try {
  //       const decoded = jwtDecode<JwtPayload>(token);

  //       if (decoded.exp && decoded.exp * 1000 < Date.now()) {
  //         console.warn("Token expiré");
  //         localStorage.removeItem("token");
  //         router.push("/auth");
  //       } else {
  //         const email = decoded.email;
  //         const member = members.find((m) => m.email === email) || null;

  //         if (member) {
  //           setUserId(member.userId);
  //           setIsMember(true);
  //           if (member.role === "ADMIN" || member.role === "OWNER") {
  //             setIsAdminOrOwner(true);
  //           }
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Erreur lors du décodage du token", err);
  //       router.push("/auth");
  //     }
  //   }
  // }, [members, router]);

  useEffect(() => {
    async () => {
      const storedToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      let token = storedToken;
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);

          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            token = await refreshToken();
          }
        } catch (error) {
          console.error("Invalid token:", error);
          token = await refreshToken();
        }
      } else {
        token = await refreshToken();
      }
      const newDecoded = jwtDecode<JwtPayload>(token!);
      const email = newDecoded.email;
      const member = members?.find((m) => m.email === email) || null;
      if (member) {
        setUserId(member.userId);
        setIsMember(true);
        if (member.role === "ADMIN" || member.role === "OWNER") {
          setIsAdminOrOwner(true);
        }
      }
    };
  }, [members, router]);

  return { isAdminOrOwner, isMember, userId };
}
