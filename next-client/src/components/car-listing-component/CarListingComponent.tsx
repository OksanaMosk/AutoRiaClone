"use client";

import React, { useState, useEffect } from "react";
import { ICar } from "@/models/ICar";
import { carService } from "@/lib/services/carService";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "./CarListingComponent.module.css";

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

interface Props {
  car: ICar;
  onDelete?: (id: string) => void;
  onStatusChange: (carId: string, status: string) => void;
}

const CarListingComponent: React.FC<Props> = ({ car, onDelete, onStatusChange }) => {
  const router = useRouter();
  const [status, setStatus] = useState<string>(car.status);
  const [stats, setStats] = useState<CarStats | null>(null);
  const [regionAvgPrice, setRegionAvgPrice] = useState<AveragePrice | null>(null);
  const [countryAvgPrice, setCountryAvgPrice] = useState<AveragePrice | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch car stats
  useEffect(() => {
    (async () => {
      try {
        const res = await carService.getStats(car.id);
        setStats(res.data);
      } catch (err) {
        console.error("Error loading car stats:", err);
        setError("Error loading car stats");
      }
    })();
  }, [car.id]);

  // Fetch average prices
  useEffect(() => {
    (async () => {
      try {
        const regionRes = await carService.getAveragePriceByRegion();
        setRegionAvgPrice(regionRes.data);
        const countryRes = await carService.getAveragePriceByCountry();
        setCountryAvgPrice(countryRes.data);
      } catch (err) {
        console.error("Error loading prices:", err);
        setError("Error loading prices");
      }
    })();
  }, [car.location]);

  // Update status
  const handleStatusChange = async () => {
    try {
      const newStatus = status === "active" ? "inactive" : "active";
      await carService.update(car.id, { status: newStatus });
      setStatus(newStatus);
      onStatusChange?.(car.id, newStatus);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating status");
    }
  };

  // Delete
  const handleDelete = async () => {
    try {
      await carService.delete(car.id);
      onDelete?.(car.id);
    } catch (err) {
      console.error(err);
      alert("Error deleting car");
    }
  };

  // Edit
  const handleEdit = () => router.push(`edit/${car.id}`);

  return (
    <tr className={styles.tableRow}>
      <td>{car.photos[0] && <Image src={car.photos[0].photo_url} alt="Car photo" width={50} height={50} />}</td>
      <td>{car.brand}</td>
      <td>{car.model}</td>
      <td>{car.year}</td>
      <td>{car.price}</td>
      <td className={status === "active" ? styles.statusActive : styles.statusInactive}>{status}</td>
      <td>
        <button onClick={handleStatusChange} className={styles.statusButton}>
          {status === "active" ? "Deactivate" : "Activate"}
        </button>
        <button onClick={handleEdit} className={styles.editButton}>Edit</button>
        <button onClick={handleDelete} className={styles.deleteButton}>Delete</button>
      </td>
      <td>
        {stats ? (
          <>
            <p>Views: {stats.total_views}</p>
            <p>Daily: {stats.daily_views}</p>
            <p>Weekly: {stats.weekly_views}</p>
            <p>Monthly: {stats.monthly_views}</p>
          </>
        ) : (
          <p>Loading stats...</p>
        )}
      </td>
      <td>
        {regionAvgPrice ? (
          <>
            <p>USD: {regionAvgPrice.USD}</p>
            <p>EUR: {regionAvgPrice.EUR}</p>
            <p>UAH: {regionAvgPrice.UAH}</p>
          </>
        ) : (
          <p>Loading region prices...</p>
        )}
      </td>
      <td>
        {countryAvgPrice ? (
          <>
            <p>USD: {countryAvgPrice.USD}</p>
            <p>EUR: {countryAvgPrice.EUR}</p>
            <p>UAH: {countryAvgPrice.UAH}</p>
          </>
        ) : (
          <p>Loading country prices...</p>
        )}
      </td>
      {error && <td className={styles.error}>{error}</td>}
    </tr>
  );
};

export default CarListingComponent;
