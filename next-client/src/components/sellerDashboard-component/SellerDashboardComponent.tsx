"use client";

import React, { useState, useEffect } from "react";
import styles from './SellerDashboardComponent.module.css';
import { ICar } from "@/models/ICar";
import { carService } from "@/lib/services/carService";
import CarListingComponent from "@/components/сarListing-component/CarListingComponent";
import { useRouter } from 'next/router';  // Для переходу на іншу сторінку

const SellerDashboardComponent = () => {
  const [cars, setCars] = useState<ICar[]>([]);
  const router = useRouter();

  useEffect(() => {
    carService.getAll().then((response) => {
      setCars(response.data);
    });
  }, []);

  const handleAddCar = async () => {
  try {
    await router.push('/create');
  } catch (error) {
    console.error("Navigation error:", error);
  }
};


  return (
    <section className={styles.userManagement}>
      <h2 className={styles.subtitle}>Manage Your Listings</h2>

      <button className={styles.blockButton} onClick={handleAddCar}>
        Add New Car
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Brand</th>
            <th>Model</th>
            <th>Year</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <CarListingComponent key={car.id} car={car} />
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default SellerDashboardComponent;




