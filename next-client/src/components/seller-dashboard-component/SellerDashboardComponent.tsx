"use client";

import React, { useEffect, useState } from "react";
import { carService } from "@/lib/services/carService";
import { ICar } from "@/models/ICar";
import styles from './SellerDashboardComponent.module.css';
import CarListingComponent from "@/components/car-listing-component/CarListingComponent";
import {LoaderComponent} from "@/components/loader-component/LoaderComponent";

type StatusFilter = "all" | "active" | "inactive";

const SellerDashboardComponent: React.FC = () => {
  const [cars, setCars] = useState<ICar[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = "current_user_id";

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await carService.getUserCars(userId);
        setCars(res.data);
      } catch (err) {
        console.error("Failed to load cars:", err);
        setError("Failed to load car data");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

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
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.filters}>
        <button onClick={() => setFilter("all")} className={filter === "all" ? styles.activeFilter : ""}>All</button>
        <button onClick={() => setFilter("active")} className={filter === "active" ? styles.activeFilter : ""}>Active</button>
        <button onClick={() => setFilter("inactive")} className={filter === "inactive" ? styles.activeFilter : ""}>Inactive</button>
      </div>
      {loading ? (
        <p><LoaderComponent/></p>
      ) : (
        <div className={styles.cardsContainer}>
          {filteredCars.map(car => (
            <CarListingComponent
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

