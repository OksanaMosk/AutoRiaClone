'use client';
import React, { useState } from "react";
import styles from './CarFilterComponent.module.css';

interface FilterProps {
  onFilterChange: (filters: Record<string, any>) => void;
}

const CarFilterComponent: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    condition: "",
    price_min: "",
    price_max: "",
    year_min: "",
    year_max: "",
    mileage_min: "",
    mileage_max: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.row}>
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={filters.brand}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={filters.model}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="condition"
          placeholder="Condition"
          value={filters.condition}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <div className={styles.row}>
        <input
          type="number"
          name="price_min"
          placeholder="Min Price"
          value={filters.price_min}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="number"
          name="price_max"
          placeholder="Max Price"
          value={filters.price_max}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="number"
          name="year_min"
          placeholder="Min Year"
          value={filters.year_min}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="number"
          name="year_max"
          placeholder="Max Year"
          value={filters.year_max}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <div className={styles.row}>
        <input
          type="number"
          name="mileage_min"
          placeholder="Min Mileage"
          value={filters.mileage_min}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="number"
          name="mileage_max"
          placeholder="Max Mileage"
          value={filters.mileage_max}
          onChange={handleChange}
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default CarFilterComponent;

