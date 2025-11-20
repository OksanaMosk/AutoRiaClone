import { apiService } from "./apiService";
import { urls } from "../constants/urls";
import { IUser } from "@/models/IUser";
import {AxiosError} from "axios";

interface IRegisterUser {
  email: string;
  password: string;
  profile: IUser["profile"];
  role?: "buyer" | "seller" | "manager" | "admin";
}

const authService = {
  async login(user: { email: string; password: string }): Promise<string> {
    try {
      const { data: { access, refresh, role } } = await apiService.post(urls.auth.login, user);
      if (typeof document !== "undefined") {
        document.cookie = `authToken=${access}; path=/; max-age=${7 * 24 * 60 * 60}; sameSite=strict`;
        document.cookie = `refreshToken=${refresh}; path=/; max-age=${30 * 24 * 60 * 60}; sameSite=strict`;
      }

      if (typeof window !== "undefined") {
        if (role === "buyer") window.location.href = "/buyer";
        else if (role === "seller") window.location.href = "/seller";
        else if (role === "manager") window.location.href = "/manager";
        else if (role === "admin") window.location.href = "/admin";
        else window.location.href = "/";
      }

      return access;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        console.error("Error response from server:", err.response);
        throw new Error("You entered an incorrect password or your credentials do not match");
      } else {
        console.error("Login error:", err.message);
        throw new Error("You entered an incorrect password or your credentials do not match");
      }
    }
  },

  async register(user: IRegisterUser): Promise<IUser> {
    const { data } = await apiService.post<IUser>(urls.auth.register, user);
    return data;
  },

  getSocketToken(): Promise<{ token: string }> {
    return apiService.get(urls.auth.socket);
  },

async getCurrentUser(token: string | null) {
  if (!token) throw new Error("No token");

  const getUser = async (t: string) => {
    const { data: { id, accountType, ...rest } } = await apiService.get(urls.auth.me, {
      headers: { Authorization: `Bearer ${t}` }
    });

    if (id && typeof window !== "undefined") {
      localStorage.setItem("userId", id.toString());
      localStorage.setItem("accountType", accountType.toString());
    }

    return { id, accountType, ...rest };
  };

  try {
    return await getUser(token);
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      const refreshToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("refreshToken="))
        ?.split("=")[1];

      if (!refreshToken) throw new Error("Session expired");

      try {
        const tokens = await this.refreshToken(refreshToken);
        document.cookie = `authToken=${tokens.access}; path=/; max-age=${7*24*60*60}; sameSite=strict`;
        if (tokens.refresh) {
          document.cookie = `refreshToken=${tokens.refresh}; path=/; max-age=${30*24*60*60}; sameSite=strict`;
        }

        return await getUser(tokens.access);
      } catch {
         await this.logout();
        throw new Error("Session expired");
      }
    }
    throw error;
  }
},

  getRefreshToken(): string | null {
    if (typeof document === "undefined") return null;
    return document.cookie.split("; ").find(row => row.startsWith("refreshToken="))?.split("=")[1] || null;
  },

async refreshToken(refreshToken: string) {
  try {
    const {
      data: { access, refresh }
    } = await apiService.post<{ access: string; refresh?: string }>(
      urls.auth.refresh,
      { refresh: refreshToken }
    );
    document.cookie =
      `authToken=${access}; path=/; max-age=${7 * 24 * 60 * 60}; sameSite=strict`;
    if (refresh) {
      document.cookie =
        `refreshToken=${refresh}; path=/; max-age=${30 * 24 * 60 * 60}; sameSite=strict`;
    }
    return {
      access,
      refresh: refresh ?? refreshToken,
    };
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw new Error("Failed to refresh token.");
  }
},

    async logout() {
        try {
            await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (e) {
            console.error("Logout API error:", e);
        }

        if (typeof window !== "undefined") {
            localStorage.clear();
            window.location.href = "/login";
        }
    },
};

export { authService };


