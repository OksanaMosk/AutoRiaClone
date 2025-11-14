
import { carService } from "@/lib/services/carService";

import CarsClientComponent from "@/components/cars-client-component/CarsClientComponent";

export default async function CarsPage() {
  const carsData = await carService.getAll();
  return <CarsClientComponent cars={carsData.data} />;
}
