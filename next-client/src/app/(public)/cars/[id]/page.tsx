import { notFound } from "next/navigation";
import { carService } from "@/lib/services/carService";
import { ICar } from "@/models/ICar";
import CarInfoComponent from "@/components/car-info-component/CarInfoComponent";
import axios from "axios";
import {GoBackButtonComponent} from "@/components/go-back-button-component/GoBackButtonComponent";
interface CarsPageProps {
  params: { id: string };
}
export default async function CarsPage({ params }: CarsPageProps) {
  const resolvedParams = await params;
  const carId = resolvedParams.id;
  let car: ICar;
    try {
        const response = await carService.get(carId);
        car = response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                return notFound();
            }
        }
        throw error;
    }
  return (
    <div>
      <GoBackButtonComponent />
      <CarInfoComponent car={car} />
    </div>
  );
}