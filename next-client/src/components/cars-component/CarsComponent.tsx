'use client';
import React, { useState, useEffect } from "react";
import CarComponent from "@/components/car-component/CarComponent";
import CarFilterComponent from "@/components/car-filter-component/CarFilterComponent";
import { ICar } from "@/models/ICar";

interface CarsProps {
  initialCars: ICar[];
}

// Чітко типізуємо фільтри
interface CarFilters {
  price_min?: number;
  price_max?: number;
  year_min?: number;
  year_max?: number;
  mileage_min?: number;
  mileage_max?: number;
  brand?: string;
  model?: string;
  condition?: string;
  [key: string]: string | number | undefined; // для додаткових фільтрів
}

export default function CarsComponent({ initialCars }: CarsProps) {
  const [cars, setCars] = useState<ICar[]>(initialCars);
  const [filters, setFilters] = useState<CarFilters>({});

  useEffect(() => {
  (async () => {
    const params = new URLSearchParams();
    for (const key in filters) {
      const value = filters[key];
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    }

    try {
      const res = await fetch(`?${params.toString()}`);
      const data = await res.json();
      setCars(data.results || data);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  })();
}, [filters]);


  return (
    <div>
      <CarFilterComponent onFilterChange={setFilters} />
      <div className="car-grid">
        {cars.map(car => (
          <CarComponent key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
}
