"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/types/jwt";
import axios from "axios";

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User;
  updateUser: (userData: Partial<User>) => void;
  refreshUserData: () => Promise<boolean>;
  refreshToken: () => Promise<string | null>;
  isInitialized: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({ username: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  const refreshToken = async (): Promise<string | null> => {
    try {
      const refreshToken =
        localStorage.getItem("refreshToken") ||
        sessionStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(
        "http://localhost:9090/api/auth/refresh",
        {
          refreshToken: refreshToken,
        },
      );

      const newToken = response.data.token;
      const newRefreshToken = response.data.refreshToken;

      if (localStorage.getItem("token")) {
        localStorage.setItem("token", newToken);
        if (newRefreshToken)
          localStorage.setItem("refreshToken", newRefreshToken);
      } else {
        sessionStorage.setItem("token", newToken);
        if (newRefreshToken)
          sessionStorage.setItem("refreshToken", newRefreshToken);
      }

      return newToken;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refreshToken");
      return null;
    }
  };

  const updateUserFromToken = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log("decoded token: ", decoded);
      setUser({
        username: decoded.username,
        email: decoded.email,
      });
      return true;
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error);
      return false;
    }
  };

  const refreshUserData = async (): Promise<boolean> => {
    const newToken = await refreshToken();
    if (newToken) {
      updateUserFromToken(newToken);
      return true;
    }
    return false;
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const logout = async () => {
    try {
      const refreshToken =
        localStorage.getItem("refreshToken") ||
        sessionStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      await axios.post("http://localhost:9090/api/auth/logout", {
        refreshToken: refreshToken,
      });
    } catch (error) {
      console.warn("Erreur lors de déconnexion coté serveur:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refreshToken");
      setUser({
        username: "Utilisateur",
        email: "non défini",
        //   name: "Utilisateur",
        //   avatar: "/avatars/avatar.jpg"
      });
    }

    router.push("/auth");
  };

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === "undefined") return;

      setIsLoading(true);
      console.log(" =================== useEffect ===================== ");
      console.log(
        "token ",
        localStorage.getItem("token") || sessionStorage.getItem("token"),
      );
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          console.log("here im ");
          router.push("/auth");
          return;
        }

        const decoded = jwtDecode<JwtPayload>(token);
        console.log(" ==== Token ==== ", token);

        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          const newToken = await refreshToken();
          if (newToken) {
            updateUserFromToken(newToken);
          } else {
            router.push("/auth");
          }
        } else {
          console.log(
            " =================== avant entrer dans updateUserFromToken ===================== ",
          );

          updateUserFromToken(token);
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'auth:", error);
        router.push("/auth");
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    // initAuth();
    const timeoutId = setTimeout(() => {
      initAuth();
    }, 100);

    return () => clearTimeout(timeoutId);
    //   }, [router]);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
        refreshUserData,
        refreshToken,
        isLoading,
        isInitialized,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// interface User {
//   name: string;
//   email: string;
// }

// interface UserContextType {
//   user: User;
//   setUser: (user: User) => void;
//   refreshUser: () => Promise<void>;
// }

// const UserContext = createContext<UserContextType | null>(null);

// export const UserProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User>({
//     name: "Utilisateur",
//     email: "non défini",
//   });

//   const router = useRouter();

//   const refreshUser = async () => {
//     const token = localStorage.getItem("token") || sessionStorage.getItem("token");
//     if (!token) return router.push("/auth");

//     try {
//       const response = await axios.get("http://localhost:9090/api/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const userData = response.data;
//       setUser({ name: userData.username, email: userData.email });
//     } catch (error) {
//       console.error("Erreur lors du fetch de l'utilisateur :", error);
//       router.push("/auth");
//     }
//   };

//   useEffect(() => {
//     refreshUser();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser, refreshUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) throw new Error("useUser doit être utilisé dans un UserProvider");
//   return context;
// };
