'use client';
import React, { useState, useEffect } from "react";
import CarComponent from "@/components/car-component/CarComponent";
import CarFilterComponent from "@/components/car-filter-component/CarFilterComponent";
import { ICar } from "@/models/ICar";

interface CarsProps {
   cars: ICar[];
   onFilterChange: (filters: Record<string, string | number>) => void;
}

const CarsComponent: React.FC<CarsProps> = ({ cars, onFilterChange }) => {
    const [filters, setFilters] = useState<Record<string, string | number>>({});

    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

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
};

export default CarsComponent;
