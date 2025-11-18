'use client';
import React, { useState, useEffect } from 'react';
import CarsComponent from "@/components/cars-component/CarsComponent";
import CarFilterComponent from "@/components/car-filter-component/CarFilterComponent";
import { carService } from "@/lib/services/carService";
import { ICar } from "@/models/ICar";
import { useSearchParams } from "next/navigation";  // Для доступу до параметрів URL

interface CarFilters {
  price_min?: number;
  price_max?: number;
  year_min?: number;
  year_max?: number;
  mileage_min?: number;
  mileage_max?: number;
  sort_order?: 'asc' | 'desc';
}

type Props = {
  cars: ICar[];
  totalPages: number;
  currentPage: number;
};
export const CarsClientComponent = ({ totalPages}: Props) => {
  const [filters, setFilters] = useState<CarFilters>({});
  const [carsData, setCarsData] = useState<ICar[]>([]);
  const [totalPagesState, setTotalPagesState] = useState(totalPages);
  const searchParams = useSearchParams();
  const currentPageFromURL = Number(searchParams.get("pg") || "1");

  const buildQueryParams = (page: number, filters: CarFilters) => {
    const params = { ...filters, page };
    return params;
  };
  const fetchCars = async (page: number, filters: CarFilters) => {
    try {
      const queryParams = buildQueryParams(page, filters);
      const response = await carService.getAll(queryParams);
      const data = response.data;
      setCarsData(data.results);
      setTotalPagesState(data.total_pages);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };


  const handleFilterChange = (newFilters: CarFilters) => {
    setFilters(newFilters);
    fetchCars(1, newFilters);
  };

useEffect(() => {
  fetchCars(currentPageFromURL, filters);
}, [currentPageFromURL, filters]);

  return (
    <div>
      <h1>Cars</h1>
      <CarFilterComponent onFilterChange={handleFilterChange} />
      <CarsComponent
        cars={carsData}
        totalPages={totalPagesState}
      />
    </div>
  );
};

