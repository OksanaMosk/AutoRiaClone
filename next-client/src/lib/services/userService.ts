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

  changeAccountType: async (userId: string, accountType: string) => {
    const { data } = await apiService.patch(urls.users.changeAccountType(userId), { account_type: accountType });
    return data;
  },

  changeRole: async (userId: string, role: string) => {
    const { data } = await apiService.patch(urls.users.changeRole(userId), { role });
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

  filterUsers: async (filterCriteria: { role?: string, account_type?: string, isBlocked?: boolean }) => {
    const { data } = await apiService.get(urls.users.filter, { params: filterCriteria });
    return data;
  },
};

export default userService
