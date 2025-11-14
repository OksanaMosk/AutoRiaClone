import React from "react";

import styles from './SellerDashboardComponent.module.css';
import {ICar} from "@/models/ICar";
import {carService} from "@/lib/services/carService";


interface CarListingProps {
  car: ICar;
}

const CarListing: React.FC<CarListingProps> = ({ car }) => {
  const handleDelete = () => {
    carService.delete(car.id).then(() => {
      alert('Car listing deleted');
    }).catch(err => {
      alert('Error deleting car');
    });
  };

  const handleEdit = () => {
    // Логіка для редагування машини
    console.log('Edit car', car.id);
  };

  return (
    <tr className={styles.tableRow}>
      <td>{car.brand}</td>
      <td>{car.model}</td>
      <td>{car.year}</td>
      <td className={car.status === 'active' ? styles.statusActive : ''}>
        {car.status}
      </td>
      <td className={styles.actions}>
        <button className={styles.blockButton} onClick={handleEdit}>Edit</button>
        <button className={`${styles.deleteButton}`} onClick={handleDelete}>Delete</button>
      </td>
    </tr>
  );
};

export default CarListing;
