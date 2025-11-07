import {apiService} from "./apiService";
import {urls} from "../constants/urls";

const authService = {
    async login(user) {
       const{data:{access}} =await apiService.post(urls.auth.login, user);
       localStorage.setItem('access', access);
    },

     async register(user) {
    return apiService.post(urls.auth.register, user);
  },

    getSocketToken() {
        return apiService.get(urls.auth.socket);
    }
}
export {authService};
