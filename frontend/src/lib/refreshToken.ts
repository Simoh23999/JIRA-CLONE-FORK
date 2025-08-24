"use client";
import axios from "axios";

export const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken =
      localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    const response = await axios.post(
      "http://localhost:9090/api/auth/refresh",
      {
        refreshToken,
      },
    );

    const newToken = response.data.token;
    const newRefreshToken = response.data.refreshToken;

    saveTokens(newToken, newRefreshToken);
    return newToken;
  } catch (error) {
    console.error("Erreur refresh:", error);
    localStorage.clear();
    sessionStorage.clear();
    return null;
  }
};

const saveTokens = (token: string, refreshToken: string | null) => {
  if (localStorage.getItem("token")) {
    localStorage.setItem("token", token);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  } else {
    sessionStorage.setItem("token", token);
    if (refreshToken) sessionStorage.setItem("refreshToken", refreshToken);
  }
};
