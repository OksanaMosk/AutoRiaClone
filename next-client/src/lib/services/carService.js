import {urls, urls as paths} from "../constants/urls";
import { apiService } from "./apiService";
import { ICar, ICarPhoto } from "@/models/ICar";

const carService = {
  action: (id: string) => `${paths.cars}/${id}/`,

  getAll() {
    return apiService.get(urls.cars.list); // Отримуємо список машин
  },

  create(data: ICar) {
    return apiService.post(urls.cars.create, data); // Створення нового оголошення
  },

  update: (id: string, data: ICar) => apiService.put(carService.action(id), data), // Оновлення машини

  delete: (id: string) => apiService.delete(carService.action(id)), // Видалення машини

  addPhoto(carId: string, photoData: ICarPhoto[]) {
    if (photoData.length > 5) {
      throw new Error("You can only upload up to 5 photos.");
    }
    return apiService.post(urls.cars.photos(carId), photoData); // Додавання фото
  },

  deletePhoto(photoId: string) {
    return apiService.delete(urls.cars.deletePhoto(photoId)); // Видалення фото
  },

  getStats(carId: string) {
    return apiService.get(urls.cars.stats(carId)); // Отримання статистики
  },

  getAveragePriceByRegion() {
    return apiService.get(urls.cars.averagePriceRegion); // Середня ціна по регіону
  },

  getAveragePriceByCountry() {
    return apiService.get(urls.cars.averagePriceCountry); // Середня ціна по країні
  }
};

export { carService };
