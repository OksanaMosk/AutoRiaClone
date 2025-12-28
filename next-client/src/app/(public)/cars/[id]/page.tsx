import CarsPageClient from "@/components/cars-page-client-component/CarsPageClient";
import ChatComponent from "@/components/chat-component/ChatComponent";
import { carService } from "@/lib/services/carService";

export default async function CarsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: carId } = await params;

  const { data: car } = await carService.get(carId);

  if (!car?.seller_id) {
    throw new Error("Car owner not found");
  }

  return (
    <div
      style={{
        margin: "40px auto",
        textAlign: "center",
        width: "100vw",
      }}
    >
      <CarsPageClient carId={carId} />
      <ChatComponent ownerId={car.seller_id}  />
    </div>
  );
}
