import { apiService } from "./apiService";
import { urls } from "../constants/urls";
import {GetUserCarsResponse} from "@/models/ICar";

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



  changeAccountType: async (userId: string, accountType: string) => {
    const { data } = await apiService.patch(urls.users.changeAccountType(userId), { account_type: accountType });
    return data;
  },

  changeRole: async (userId: string, role: string) => {
    const { data } = await apiService.patch(urls.users.changeRole(userId), { role });
    return data;
  },


  delete: async (userId: string) => {
    const { data } = await apiService.delete(urls.users.delete(userId));
    return data;
  },
  getUserCars(userId: string) {
  return apiService.get<GetUserCarsResponse>(urls.users.userCars(userId));
},

 filterSortUsers: async (filterCriteria: {
    role?: string,
    account_type?: string,
    is_active?: boolean,
    sort_by?: string,
    sort_order?: 'asc' | 'desc'
  }) => {
    const { data } = await apiService.get(urls.users.filterSort, { params: filterCriteria });
    return data;
  },
};

export default userService
