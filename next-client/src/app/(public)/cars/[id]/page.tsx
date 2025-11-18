
import CarComponent from "@/components/car-component/CarComponent";
import {GoBackButtonComponent} from "@/components/goBack-button-component/GoBackButtonComponent";

export default async function CarsPage() {
  return (
      <div>
          <GoBackButtonComponent/>
          <CarComponent car={car}/>
      </div>
  );
}
