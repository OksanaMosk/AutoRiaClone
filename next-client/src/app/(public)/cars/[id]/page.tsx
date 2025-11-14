
import { carService } from "@/lib/services/carService";
import CarComponent from "@/components/car-component/CarComponent";

export default async function CarsPage() {
  const carsData = await carService.getAll();
  return <CarComponent car={carsData.data} />;
}
