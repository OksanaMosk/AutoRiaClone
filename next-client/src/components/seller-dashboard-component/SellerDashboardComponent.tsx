"use client";

import React, { useEffect, useState } from "react";
import { ICar } from "@/models/ICar";
import { IUser } from "@/models/IUser";
import { authService } from "@/lib/services/authService";
import userService from "@/lib/services/userService";
import CarListingComponent from "@/components/car-listing-component/CarListingComponent";
import { LoaderComponent } from "@/components/loader-component/LoaderComponent";
import styles from "./SellerDashboardComponent.module.css";

const SellerDashboardComponent: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [cars, setCars] = useState<ICar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = authService.getRefreshToken();
        if (!token) {
          setError("Please activate your account.");
          return;
        }
        const userData = await authService.getCurrentUser(token);
        setUser(userData);
      } catch (err) {
        console.error("Failed to load user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
      (async () => {
          setLoading(true);
          try {
              const response = await userService.getUserCars(userId);
              console.log("User cars response:", response);
              const cars = response.data.cars;
              setCars(cars);
          } catch (err) {
              console.error("Failed to load cars:", err);
              setError("Failed to load cars.");
          } finally {
              setLoading(false);
          }
      })();
  }, [user]);
    const handleDelete = (carId: string) => {
        setCars((prev) => prev.filter((c) => c.id !== carId));
    };
    const handleStatusChange = (carId: string, status: string) => {
        setCars((prev) =>
      prev.map((car) => (car.id === carId ? { ...car, status } : car))
    );
  };
  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <LoaderComponent />
      </div>
    );
  if (error) return <p className={styles.errorText}>{error}</p>;
  return (
    <div className={styles.dashboard}>
      <h2>My Car Listings</h2>
      <div className={styles.cardsContainer}>
        {cars.length > 0 ? (
          cars.map((car) => (
            <CarListingComponent
              key={car.id}
              car={car}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <p>No cars found.</p>
        )}
      </div>
    </div>
  );
};

export default SellerDashboardComponent;