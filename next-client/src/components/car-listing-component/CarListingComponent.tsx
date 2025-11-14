import React from "react";
import { ICar } from "@/models/ICar";
import { carService } from "@/lib/services/carService";
import { useRouter } from "next/router";
import styles from './SellerDashboardComponent.module.css';
import Image from "next/image";

interface Props {
  car: ICar;
  onDelete?: (id: string) => void;
}

const CarListingComponent: React.FC<Props> = ({ car, onDelete }) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await carService.delete(car.id);
      onDelete?.(car.id);
    } catch (err) {
      console.error(err);
      alert("Error deleting car");
    }
  };

  const handleEdit = async () => {
   await router.push(`/cars/edit/${car.id}`);
  };

  return (
    <tr className={styles.tableRow}>
      <td>
        {car.photos[0] && <Image src={car.photos[0].photo_url} alt="" width={50} />}
      </td>
      <td>{car.brand}</td>
      <td>{car.model}</td>
      <td>{car.year}</td>
      <td>{car.price}</td>
      <td className={car.status === "active" ? styles.statusActive : ""}>
        {car.status}
      </td>
      <td>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </td>
    </tr>
  );
};

export default CarListingComponent;

