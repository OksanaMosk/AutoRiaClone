import { apiService } from "./apiService";
import { urls } from "../constants/urls";
import { IUser } from "@/models/IUser";

interface IRegisterUser {
  email: string;
  password: string;
  profile: IUser["profile"];
  role?: "buyer" | "seller" | "manager" | "admin";
}

const authService = {
async login(user: { email: string; password: string }): Promise<string> {
  try {
    const { data: { access, role } } = await apiService.post(urls.auth.login, user);
    document.cookie = `authToken=${access}; path=/; max-age=${7 * 24 * 60 * 60}; sameSite=strict`;

    if (role === "buyer") {
      console.log('role:', role);
      window.location.href = "/buyer";
    } else if (role === "seller") {
      window.location.href = "/seller";
    } else if (role === "manager") {
      window.location.href = "/manager";
    } else if (role === "superuser") {
      window.location.href = "/superuser";
    } else {
      window.location.href = "/";
    }

    return access;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response from server:", error.response);
    } else {
      console.error("Login error:", error);
    }
    throw new Error("Login failed");
  }
}
,

  async register(user: IRegisterUser): Promise<IUser> {
    const { data } = await apiService.post<IUser>(urls.auth.register, user);
    return data;
  },



  getSocketToken(): Promise<{ token: string }> {
    return apiService.get(urls.auth.socket);
  },

    async getCurrentUser(token: string) {
    const { data } = await apiService.get(urls.auth.me, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

    logout(): void {
    document.cookie = "authToken=; path=/; max-age=0; sameSite=strict";
  },

};

export { authService };

