// const baseURL = "/api";

const paths = {
  auth: "/auth",
  cars: "/cars",
  users: "/users",
};

export const urls = {
    auth: {
        refresh: `${paths.auth}/refresh/`,
        register: `${paths.auth}/register/`,
        login: `${paths.auth}/login/`,
        socket: `${paths.auth}/socket/`,
        me: `${paths.auth}/me/`,
    },

    users: {
        list: `${paths.users}/`,
        block: (id: string) => `${paths.users}/${id}/block/`,
        unblock: (id: string) => `${paths.users}/${id}/unblock/`,
        changeAccountType: (id: string) => `${paths.users}/change-account-type/${id}/`,
        changeRole: (id: string) => `${paths.users}/change-role/${id}/`,
        delete: (id: string) => `${paths.users}/${id}/delete/`,
        filter: `${paths.users}/filter/`,
    },

  cars: paths.cars,
};
 // update: (id: string) => `${paths.users}/${id}/update/`,
 //   promoteToAdmin: (id: string) => `${paths.users}/${id}/to_admin/`,

