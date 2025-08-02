// "use client";

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
