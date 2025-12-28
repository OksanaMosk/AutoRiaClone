import {urls, urls as paths} from "../constants/urls";
import {apiService} from "./apiService";
import {ICar} from "@/models/ICar";

const carService = {
    action: (id: string) => `${paths.cars}/${id}/`,

    getAll: async (filterCriteria: {
    price_min?: number;
    price_max?: number;
    year_min?: number;
    year_max?: number;
    mileage_min?: number;
    mileage_max?: number;
    brand?: string;
    model?: string;
    condition?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    }) => {
    const { data } = await apiService.get(urls.cars.list, { params: filterCriteria });
    return data;
  },

    get(id: string) {
        return apiService.get<ICar>(urls.cars.action(id));
    },

    create(data: ICar) {
        console.log(data);
        return apiService.post<ICar>(urls.cars.create, data);
    },

    update(id: string, data: Partial<ICar>) {
        return apiService.put<ICar>(urls.cars.action(id), data);
    },

    delete(id: string) {
        return apiService.delete(urls.cars.action(id));
    },

    addPhoto(carId: string, formData: FormData) {
    return apiService.post(urls.cars.photos(carId), formData, {
        withCredentials: true,
    });
},
    deletePhoto(photoId: string) {
        return apiService.delete(urls.cars.deletePhoto(photoId));
    },

    getExchangeRates() {
        return apiService.get(urls.cars.exchangeRates);
    },

    getStats(carId: string) {
        const url = urls.cars.stats(carId);
        return apiService.get(url);
    },

    getAveragePriceByRegion: (region: string, model?: string) => {
        const params = new URLSearchParams();
        params.append("region", region);

        if (model) {
            params.append("model", model);
        }

        const query = params.toString();
        const url = `${urls.cars.averagePriceRegion}?${query}`;

        console.log("Request URL (region):", url);
        return apiService.get(url);
    },

    getAveragePriceByCountry: (model?: string) => {
        const params = new URLSearchParams();

    if (model) {
        params.append("model", model);
    }

    const query = params.toString();
    const url = query
        ? `${urls.cars.averagePriceCountry}?${query}`
        : urls.cars.averagePriceCountry;

    console.log("Request URL (country):", url);
    return apiService.get(url);
},

    getConstants() {
        return apiService.get(urls.cars.constants);
    },
};

export {carService};
