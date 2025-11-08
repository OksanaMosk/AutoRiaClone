import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const apiService = axios.create({ baseURL });

if (typeof window !== "undefined") {
  apiService.interceptors.request.use((req) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (token && req.headers) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  });
}

export { apiService };






// import axios from "axios";
// import {baseURL} from "../constants/urls";
//
// const apiService=axios.create({baseURL});
//
// apiService.interceptors.request.use(req=>{
//     const token=localStorage.getItem("access");
//
//     if(token){
//         req.headers.Authorization = `Bearer ${token}`;
//     }
//     return req;
// })
// export {apiService};
