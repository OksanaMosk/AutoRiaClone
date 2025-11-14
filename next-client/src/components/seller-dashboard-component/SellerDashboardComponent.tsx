"use client";

import React, { useEffect, useState } from "react";
import { carService } from "@/lib/services/carService";
import { ICar } from "@/models/ICar";

import styles from './SellerDashboardComponent.module.css';
import CarListingComponent from "@/components/car-listing-component/CarListingComponent";

type StatusFilter = "all" | "active" | "inactive";

const SellerDashboardComponent: React.FC = () => {
  const [cars, setCars] = useState<ICar[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await carService.getAll(); // В ідеалі фільтрувати по sellerId на бекенді
      setCars(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = (carId: string) => {
    setCars(prev => prev.filter(c => c.id !== carId));
  };

  const filteredCars = cars.filter(car => {
    if (filter === "all") return true;
    return filter === "active" ? car.status === "active" : car.status !== "active";
  });

  return (
    <div className={styles.dashboard}>
      <h2>My Car Listings</h2>

      <div className={styles.filters}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("inactive")}>Inactive</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Year</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.map(car => (
              <CarListingComponent key={car.id} car={car} onDelete={handleDelete} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SellerDashboardComponent;