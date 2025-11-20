"use client";

import React, { useEffect, useState } from "react";
import { ICar } from "@/models/ICar";
import { IUser } from "@/models/IUser";
import { authService } from "@/lib/services/authService";
import userService from "@/lib/services/userService";
import CarListingComponent from "@/components/car-listing-component/CarListingComponent";
import { LoaderComponent } from "@/components/loader-component/LoaderComponent";
import styles from "./SellerDashboardComponent.module.css";
import AccountsComponent from "@/components/accounts-component/AccountsComponent";

const SellerDashboardComponent: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [cars, setCars] = useState<ICar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];

      if (!token) {
        setError("Please activate your account.");
        setLoading(false);
        return;
      }

      try {
        const userData = await authService.getCurrentUser(token);
        setUser(userData);
      } catch (e) {
        console.error("Error fetching user:", e);

        const refreshToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("refreshToken="))
          ?.split("=")[1];

        if (!refreshToken) {
          setError("Please log in again.");
          setLoading(false);
          return;
        }

        try {
          const tokens = await authService.refreshToken(refreshToken);
          const userData = await authService.getCurrentUser(tokens.access);
          setUser(userData);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          setError("Your session has expired. Please log in again.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // -------------------------
  // Load user's cars
  // -------------------------
  useEffect(() => {
    if (!user?.id) return;

    const loadCars = async () => {
      setLoading(true);
      try {
      if (!user?.id) return; // якщо undefined, нічого не робимо
const response = await userService.getUserCars(String(user.id));
        setCars(response.data.cars);
      } catch (err) {
        console.error("Failed to load cars:", err);
        setError("Failed to load cars.");
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, [user]);

  // -------------------------
  // Handlers
  // -------------------------
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
        <AccountsComponent/>
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
