'use client';
import React from 'react';
import CarComponent from "@/components/car-component/CarComponent";
import { PaginationComponent } from "@/components/pagination-component/PaginationComponent";
import { ICar } from "@/models/ICar";

interface CarListComponentProps {
  cars: ICar[];
  totalPages: number;
}

const CarsComponent: React.FC<CarListComponentProps> = ({ cars, totalPages }) => {

  return (
    <div>
      <div className="car-list">
        {cars.length > 0 ? (cars.map((car) => (
          <CarComponent key={car.id} car={car} />
        ))):( <p>No cars available.</p>)}
      </div>

      <PaginationComponent
        totalPages={totalPages}
      />
    </div>
  );
};

export default CarsComponent;




