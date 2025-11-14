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
      const res = await carService.getAll();
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

  const handleStatusChange = (carId: string, status: string) => {
    setCars(prev =>
      prev.map(car => (car.id === carId ? { ...car, status } : car))
    );
  };

  const filteredCars = cars.filter(car => {
    if (filter === "all") return true;
    return filter === "active" ? car.status === "active" : car.status !== "active";
  });

  return (
    <div className={styles.dashboard}>
      <h2>My Car Listings</h2>

      <div className={styles.filters}>
        <button onClick={() => setFilter("all")} className={filter === "all" ? styles.activeFilter : ""}>All</button>
        <button onClick={() => setFilter("active")} className={filter === "active" ? styles.activeFilter : ""}>Active</button>
        <button onClick={() => setFilter("inactive")} className={filter === "inactive" ? styles.activeFilter : ""}>Inactive</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.cardsContainer}>
          {filteredCars.map(car => (
            <CarComponent
              key={car.id}
              car={car}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerDashboardComponent;
