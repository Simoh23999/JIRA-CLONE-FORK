import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

export interface Member {
  userId: number;
  username: string;
  fullName: string;
  avatarUrl?: string;
  role: "OWNER" | "MEMBER" | "ADMIN";
}

export const fetchMembers = async (orgId: number): Promise<{ members: Member[] }> => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${baseURL}/organizations/${orgId}/members`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; // { members: [...] }
};
