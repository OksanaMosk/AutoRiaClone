import React, { useState, useEffect } from "react";
import { ICar } from "@/models/ICar";
import { carService } from "@/lib/services/carService"; // Assuming carService exists
import { useRouter } from "next/router";
import styles from './SellerDashboardComponent.module.css';
import Image from "next/image";

// Extend the ICar interface for the stats
interface CarStats {
  total_views: number;
  daily_views: number;
  weekly_views: number;
  monthly_views: number;
}

// Extend the ICar interface for average price by region and country
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

const CarListingComponent: React.FC<Props> = ({ car }) => {
  const router = useRouter();
  const [status, setStatus] = useState<string>(car.status);
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<CarStats | null>(null); // Car stats
  const [regionAvgPrice, setRegionAvgPrice] = useState<AveragePrice | null>(null); // Average price by region
  const [countryAvgPrice, setCountryAvgPrice] = useState<AveragePrice | null>(null); // Average price by country
  const [error, setError] = useState<string | null>(null);

  // Fetch car stats
useEffect(() => {
  (async () => {
    setLoading(true);
    try {
      const res = await carService.getStats(car.id);
      setStats(res.data); // Assume response contains the required stats
    } catch (err) {
      console.error("Error loading car stats:", err);
      setError("Error loading car stats");
    } finally {
      setLoading(false);
    }
  })();
}, [car.id]);

// Fetch average price by region and country
useEffect(() => {
  (async () => {
    setLoading(true);
    try {
      // For region: fetch average price for the region
      const regionRes = await carService.getAveragePriceByRegion(); // No region argument here
      setRegionAvgPrice(regionRes.data);

      // For country: fetch data for the entire country
      const countryRes = await carService.getAveragePriceByCountry();
      setCountryAvgPrice(countryRes.data);
    } catch (err) {
      console.error("Error loading prices:", err);
      setError("Error loading prices");
    } finally {
      setLoading(false);
    }
  })();
}, [car.location]);


  // Update car status
  const handleStatusChange = async () => {
    try {
      setLoading(true);
      const newStatus = status === "active" ? "inactive" : "active";
      await carService.update(car.id, { status: newStatus });
      setStatus(newStatus);
    } catch (err) {
      console.error("Error updating car status:", err);
      alert("Error updating car status");
    } finally {
      setLoading(false);
    }
  };

  // Delete car
  const handleDelete = async () => {
    try {
      await carService.delete(car.id);
    } catch (err) {
      console.error(err);
      alert("Error deleting car");
    }
  };

  // Edit car
  const handleEdit = async () => {
    await router.push(`edit/${car.id}`);
  };

  return (
    <tr className={styles.tableRow}>
      <td>
        {car.photos[0] && <Image src={car.photos[0].photo_url} alt="Car photo" width={50} height={50} />}
      </td>
      <td>{car.brand}</td>
      <td>{car.model}</td>
      <td>{car.year}</td>
      <td>{car.price}</td>
      <td className={status === "active" ? styles.statusActive : styles.statusInactive}>
        {status}
      </td>
      <td>
        <button
          onClick={handleStatusChange}
          className={styles.statusButton}
          disabled={loading}
        >
          {status === "active" ? "Deactivate" : "Activate"}
        </button>
        <button onClick={handleEdit} className={styles.editButton}>Edit</button>
        <button onClick={handleDelete} className={styles.deleteButton}>Delete</button>
      </td>
            {error && <p className="error">{error}</p>}

      <td>
        {stats ? (
          <div>
            <p>Views: {stats.total_views}</p>
            <p>Daily views: {stats.daily_views}</p>
            <p>Weekly views: {stats.weekly_views}</p>
            <p>Monthly views: {stats.monthly_views}</p>
          </div>
        ) : (
          <p>Loading stats...</p>
        )}
      </td>

      <td>
        {regionAvgPrice ? (
          <div>
            <p>Avg price in USD: {regionAvgPrice.USD}</p>
            <p>Avg price in EUR: {regionAvgPrice.EUR}</p>
            <p>Avg price in UAH: {regionAvgPrice.UAH}</p>
          </div>
        ) : (
          <p>Loading region prices...</p>
        )}
      </td>
      <td>
        {countryAvgPrice ? (
          <div>
            <p>Avg price in USD: {countryAvgPrice.USD}</p>
            <p>Avg price in EUR: {countryAvgPrice.EUR}</p>
            <p>Avg price in UAH: {countryAvgPrice.UAH}</p>
          </div>
        ) : (
          <p>Loading country prices...</p>
        )}
      </td>
    </tr>
  );
};

export default CarListingComponent;
