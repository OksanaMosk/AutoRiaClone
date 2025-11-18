'use client';
import React from 'react';
import CarComponent from "@/components/car-component/CarComponent";
import { PaginationComponent } from "@/components/pagination-component/PaginationComponent";
import { ICar } from "@/models/ICar";
import styles from "./CarsComponent.module.css";
import Link from "next/link";

interface CarListComponentProps {
  cars: ICar[];
  totalPages: number;
}

const CarsComponent: React.FC<CarListComponentProps> = ({ cars, totalPages }) => {
  return (
    <div className={styles.carsListContainer}>
      <ul className={styles.list}>
        {cars.map((car) => (
  <li  key={car.id}>
    <Link
      href={`/cars/${car.id}`}
      className={styles.link}
    >
      <CarComponent car={car} />
    </Link>
  </li>
))}
      </ul>

      <PaginationComponent totalPages={totalPages} />
    </div>
  );
};

export default CarsComponent;





