import { apiService } from "./apiService";
import { urls } from "../constants/urls";

 const userService = {

  getAll: async () => {
    const { data } = await apiService.get(urls.users.list);
    return data;
  },

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
  },

  sendTestEmail: async () => {
    const { data } = await apiService.get(urls.users.testEmail);
    return data;
  },

  update: async (userId: string, userData: { email?: string, role?: string, account_type?: string }) => {
    const { data } = await apiService.patch(urls.users.update(userId), userData);
    return data;
  },

  delete: async (userId: string) => {
    const { data } = await apiService.delete(urls.users.delete(userId));
    return data;
  },

  // getUserRole: async (userId: string) => {
  //   const { data } = await apiService.get(urls.users.getUserRole(userId));
  //   return data;
  // },

  filterUsers: async (filterCriteria: { role?: string, account_type?: string, isBlocked?: boolean }) => {
    const { data } = await apiService.get(urls.users.filter, { params: filterCriteria });
    return data;
  },

  // resetPassword: async (userId: string) => {
  //   const { data } = await apiService.post(urls.users.resetPassword(userId));
  //   return data;
  // },

  // getStatus: async (userId: string) => {
  //   const { data } = await apiService.get(urls.users.status(userId));
  //   return data;
  // },
}

export default userService



// create: async (userData: {
  //   email: string;
  //   password: string;
  //   role?: string;
  //   account_type?: string;
  // }) => {
  //   const { data } = await apiService.post(urls.users.create, userData);
  //   return data;
  // },