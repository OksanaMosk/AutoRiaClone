import { apiService } from "./apiService";
import { urls } from "../constants/urls";

export const userService = {

  getAll: async () => {
    const { data } = await apiService.get(urls.users.list);
    return data;
  },


  // create: async (userData: {
  //   email: string;
  //   password: string;
  //   role?: string;
  //   account_type?: string;
  // }) => {
  //   const { data } = await apiService.post(urls.users.create, userData);
  //   return data;
  // },


  block: async (userId: string) => {
    const { data } = await apiService.patch(urls.users.block(userId));
    return data;
  },


  unblock: async (userId: string) => {
    const { data } = await apiService.patch(urls.users.unblock(userId));
    return data;
  },


  promoteToAdmin: async (userId: string) => {
    const { data } = await apiService.patch(urls.users.promoteToAdmin(userId));
    return data;
  }


//   sendTestEmail: async () => {
//     const { data } = await apiService.get(urls.users.testEmail);
//     return data;
//   },
}
