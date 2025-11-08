import { apiService } from "./apiService";
import { urls } from "../constants/urls";
import { IUser } from "@/models/IUser";

interface IRegisterUser {
  email: string;
  password: string;
  profile: IUser["profile"];
}

const authService = {
  async login(user: { email: string; password: string }): Promise<string> {
    const { data: { access } } = await apiService.post(urls.auth.login, user);


    document.cookie = `authToken=${access}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;

    return access;
  },

  async register(user: IRegisterUser): Promise<IUser> {
    const { data } = await apiService.post<IUser>(urls.auth.register, user);
    return data;
  },

  getSocketToken(): Promise<{ token: string }> {
    return apiService.get(urls.auth.socket);
  }
};

export { authService };

