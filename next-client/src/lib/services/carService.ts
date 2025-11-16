import {urls, urls as paths} from "../constants/urls";
import {apiService} from "./apiService";
import {ICar} from "@/models/ICar";

const carService = {
    action: (id: string) => `${paths.cars}/${id}/`,

    getAll() {
        return apiService.get(urls.cars.list);
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

    getAveragePriceByRegion: (region: string) => {
        const url = `${urls.cars.averagePriceRegion}?region=${encodeURIComponent(region)}`;
        return apiService.get(url);
    },

    getAveragePriceByCountry: () => {
        const url = urls.cars.averagePriceCountry;
        return apiService.get(url);
    },

    getConstants() {
        return apiService.get(urls.cars.constants);
    },
};

export {carService};
