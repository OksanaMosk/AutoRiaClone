"use client";
import { useState, useEffect } from "react";
import { carService } from "@/lib/services/carService";
import { ICar } from "@/models/ICar";
import CarInfoComponent from "@/components/car-info-component/CarInfoComponent";
import { GoBackButtonComponent } from "@/components/go-back-button-component/GoBackButtonComponent";

interface CarsPageClientProps {
  carId: string;
}

export default function CarsPageClient({ carId }: CarsPageClientProps) {
  const [car, setCar] = useState<ICar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!carId) return;

    (async () => {
      try {
        const response = await carService.get(carId);
        setCar(response.data);
      } catch (err) {
        setError("Failed to fetch car details");
      } finally {
        setLoading(false);
      }
    })();
  }, [carId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!car) return <div>Car not found</div>;

  return (
    <div>
      <GoBackButtonComponent />
      <CarInfoComponent car={car} />
    </div>
  );
}

