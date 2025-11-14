import React, { useState } from "react";
import { ICar } from "@/models/ICar";
import { carService } from "@/lib/services/carService";
import { useRouter } from "next/router";
import styles from './SellerDashboardComponent.module.css';
import Image from "next/image";

interface Props {
  car: ICar;
  onDelete?: (id: string) => void;
}

const CarListingComponent: React.FC<Props> = ({ car}) => {
  const router = useRouter();
  const [status, setStatus] = useState<string>(car.status); // Зберігаємо статус автомобіля в state
  const [loading, setLoading] = useState<boolean>(false);
  const handleStatusChange = async () => {
    try {
      setLoading(true);
      const newStatus = status === "active" ? "inactive" : "active";
      await carService.update(car.id, { status: newStatus });
      setStatus(newStatus);

    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating car status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await carService.delete(car.id);
    } catch (err) {
      console.error(err);
      alert("Error deleting car");
    }
  };

  const handleEdit = async () => {
   await router.push(`/edit-car/${car.id}`);
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
    </tr>
  );
};

export default CarListingComponent;

