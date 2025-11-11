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
        promoteToAdmin: (id: string) => `${paths.users}/${id}/to_admin/`,
        changeAccountType: (id: string) => `${paths.users}/change-account-type/${id}/`,
        changeRole: (id: string) => `${paths.users}/change-role/${id}/`,
        update: (id: string) => `${paths.users}/${id}/update/`,
        delete: (id: string) => `${paths.users}/${id}/delete/`,
        status: (id: string) => `${paths.users}/${id}/status/`,
        getUserRole: (id: string) => `${paths.users}/${id}/role/`,
        resetPassword: (id: string) => `${paths.users}/${id}/reset-password/`,
        filter: `${paths.users}/filter/`,
        testEmail: `${paths.users}/test/`,

    },

  cars: paths.cars,
};



