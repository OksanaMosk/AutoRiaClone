"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ICar } from "@/models/ICar";
import { carService } from "@/lib/services/carService";
import Link from "next/link";
import styles from "./CarListingComponent.module.css";
import axios from "axios";

interface CarStats {
  total_views: number;
  daily_views: number;
  weekly_views: number;
  monthly_views: number;
}

interface AveragePrice {
  USD: number;
  EUR: number;
  UAH: number;
}

interface IUser {
  account_type: string;
  email?: string;
}

interface Props {
  car: ICar;
  user?: IUser;
  onDelete?: (id: string) => void;
  onStatusChange?: (carId: string, status: string) => void;
}

const CarListingComponent: React.FC<Props> = ({ car, user, onDelete, onStatusChange }) => {
  const [status, setStatus] = useState<string>(car.status);
  const [stats, setStats] = useState<CarStats | null>(null);
  const [regionAvgPrice, setRegionAvgPrice] = useState<AveragePrice | null>(null);
  const [countryAvgPrice, setCountryAvgPrice] = useState<AveragePrice | null>(null);
  const [error, setError] = useState<string | null>(null);

  const storedUser: IUser | null = useMemo(() => {
    const accountType = localStorage.getItem("accountType");
    if (accountType === "premium") return { account_type: "premium" };
    if (accountType === "basic") return { account_type: "basic" };
    return null;
  }, []);

  const activeUser = storedUser || user;

  useEffect(() => {
  if (!activeUser || activeUser.account_type !== "premium") return;

  (async () => {
    try {
      setError(null);

      const statsRes = await carService.getStats(car.id);
      setStats(statsRes.data);

      const regionRes = await carService.getAveragePriceByRegion(car.location);
      setRegionAvgPrice(regionRes.data.average_price);

      const countryRes = await carService.getAveragePriceByCountry();
      setCountryAvgPrice(countryRes.data.average_price);

    } catch (err) {
      console.error("UNKNOWN ERROR:", err);
      setError("Error loading stats and prices");
    }
  })();
}, [car.id, car.location, activeUser]);


  const handleStatusChange = async () => {
  if (status === "pending") {
    alert("You cannot change status while the car is pending review.");
    return;
  }

  try {
    const newStatus = status === "active" ? "inactive" : "active";
    await carService.update(car.id, { status: newStatus });
    setStatus(newStatus);
    onStatusChange?.(car.id, newStatus);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("BACKEND ERROR:", err.response?.data);
    } else {
      console.error("UNKNOWN ERROR:", err);
    }
    alert("Error updating status");
  }
};


  const handleDelete = async () => {
    try {
      await carService.delete(car.id);
      onDelete?.(car.id);
    } catch (err) {
      console.error(err);
      alert("Error deleting car");
    }
  };

  return (
    <div className={styles.wrapper}>
      {error && <p className={styles.error}>{error}</p>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Brand</th>
            <th>Model</th>
            <th>Year</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Stats</th>
            <th>Region Avg Price</th>
            <th>Country Avg Price</th>
          </tr>
        </thead>
        <tbody>
          <tr key={car.id} className={styles.tableRow}>
            <td className={styles.user}>{car.brand}</td>
            <td className={styles.user}>{car.model}</td>
            <td className={styles.user}>{car.year}</td>
            <td className={styles.user}>{car.price}</td>
            <td className={status === "active" ? styles.statusActive : styles.statusInactive}>
              {status}
            </td>
              <td className={styles.actions}>
                  <button className={styles.button} onClick={handleStatusChange}>
                      {status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <Link href={`/cars/edit/${car.id}`} passHref>
                      <button className={styles.editButton}>Edit</button>
                  </Link>
                  <button onClick={handleDelete} className={styles.deleteButton}>Delete</button>
              </td>
            <td className={styles.user}>
              {activeUser?.account_type === "premium" ? (
                stats ? (
                  <>
                    <p>Views: {stats.total_views}</p>
                    <p>Daily: {stats.daily_views}</p>
                    <p>Weekly: {stats.weekly_views}</p>
                    <p>Monthly: {stats.monthly_views}</p>
                  </>
                ) : (
                  <p>Loading stats...</p>
                )
              ) : (
                <p>Premium required</p>
              )}
            </td>
            <td className={styles.user}>
              {activeUser?.account_type === "premium" ? (
                regionAvgPrice ? (
                  <>
                    <p>USD: {regionAvgPrice.USD}</p>
                    <p>EUR: {regionAvgPrice.EUR}</p>
                    <p>UAH: {regionAvgPrice.UAH}</p>
                  </>
                ) : (
                  <p>Loading region prices...</p>
                )
              ) : (
                <p>Premium required</p>
              )}
            </td>
            <td className={styles.user}>
              {activeUser?.account_type === "premium" ? (
                countryAvgPrice ? (
                  <>
                    <p>USD: {countryAvgPrice.USD}</p>
                    <p>EUR: {countryAvgPrice.EUR}</p>
                    <p>UAH: {countryAvgPrice.UAH}</p>
                  </>
                ) : (
                  <p>Loading country prices...</p>
                )
              ) : (
                <p>Premium required</p>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CarListingComponent;
