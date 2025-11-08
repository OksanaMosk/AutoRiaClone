const baseURL = "/api";

const paths = {
  auth: "/auth",
  cars: "/cars",
  users: "/users",
};

export const urls = {
  auth: {
    register: `${paths.auth}/register/`,
    login: `${paths.auth}/login/`,
    socket: `${paths.auth}/socket/`,
  },

  users: {
    list: `${paths.users}/`,
    create: `${paths.users}/`,  // реєстрація через /auth/register, тут можна видалити
    block: (id: string) => `${paths.users}/${id}/block/`,
    unblock: (id: string) => `${paths.users}/${id}/unblock/`,
    promoteToAdmin: (id: string) => `${paths.users}/${id}/to_admin/`,
    testEmail: `${paths.users}/test/`,
  },

  cars: paths.cars,
};

export { baseURL };

