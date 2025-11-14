"use client";

import React, { useState, useEffect } from "react";
import styles from './SellerDashboardComponent.module.css';
import {ICar} from "@/models/ICar";
import {carService} from "@/lib/services/carService";
import CarListingComponent from "@/components/сarListing-component/CarListingComponent";


const SellerDashboardComponent = () => {
  const [cars, setCars] = useState<ICar[]>([]);

  useEffect(() => {
    carService.getAll().then((data) => {
      setCars(data);
    });
  }, []);

  return (
    <section className={styles.userManagement}>
      <h2 className={styles.subtitle}>Manage Your Listings</h2>
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



