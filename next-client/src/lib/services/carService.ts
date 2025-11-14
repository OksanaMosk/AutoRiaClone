import {urls, urls as paths} from "../constants/urls";
import { apiService } from "./apiService";
import { ICar, ICarPhoto } from "@/models/ICar";

const carService = {
  action: (id: string) => `${paths.cars}/${id}/`,

  getAll() {
    return apiService.get(urls.cars.list);
  },

  create(data: ICar) {
    return apiService.post(urls.cars.create, data);
  },

  update: (id: string, data: ICar) => apiService.put(carService.action(id), data),

  delete: (id: string) => apiService.delete(carService.action(id)),

  addPhoto(carId: string, photoData: ICarPhoto[]) {
    if (photoData.length > 5) {
      throw new Error("You can only upload up to 5 photos.");
    }
    return apiService.post(urls.cars.photos(carId), photoData);
  },

  deletePhoto(photoId: string) {
   return apiService.delete(urls.cars.deletePhoto(photoId));
  },

  getStats(carId: string) {
    return apiService.get(urls.cars.stats(carId));
  },

    getExchangeRates() {
    return apiService.get(urls.cars.exchangeRates);
  },

  getAveragePriceByRegion() {
    return apiService.get(urls.cars.averagePriceRegion);
  },

  getAveragePriceByCountry() {
    return apiService.get(urls.cars.averagePriceCountry);
  }
};

export { carService };
