import axios from "axios";
import { JwtPayload } from "@/types/jwt";
import { refreshToken } from "@/lib/refreshToken";
import { jwtDecode } from "jwt-decode";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

export interface Member {
  userId: number;
  username: string;
  fullName: string;
  avatarUrl?: string;
  role: "OWNER" | "MEMBER" | "ADMIN";
}

export const fetchMembers = async (
  orgId: number,
): Promise<{ members: Member[] }> => {
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
  const res = await axios.get(`${baseURL}/organizations/${orgId}/members`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; // { members: [...] }
};
