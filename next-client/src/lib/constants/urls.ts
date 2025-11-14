

const paths = {
  auth: "/auth",
  cars: "/cars",
  users: "/users",
  carPhotos: "/cars/photos",
  carStats: "/cars/stats",
  carAveragePrice: "/cars/stats/average",
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
        filterSort: `${paths.users}/filter-sort/`,
    },

    cars: {
        list: `${paths.cars}/`,
        create: `${paths.cars}/create/`,
        action: (id: string) => `${paths.cars}/${id}/`,
        photos: (carId: string) => `${paths.cars}/${carId}/photos/`,
        deletePhoto: (photoId: string) => `${paths.carPhotos}/${photoId}/`,
        stats: (carId: string) => `${paths.cars}/${carId}/stats/`,
        averagePriceRegion: `${paths.carAveragePrice}/`,
        averagePriceCountry: `${paths.carAveragePrice}/country/`,
        exchangeRates: `${paths.cars}/exchange-rates/`,
        constants: `${paths.cars}/constants/`,
    },
};

