'use client';
import React, { useState, useEffect } from "react";
import styles from './CarFilterComponent.module.css';
import { carService } from "@/lib/services/carService";

interface FilterProps {
  onFilterChange: (filters: Record<string, string>) => void;
}

const CarFilterComponent: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    condition: "",
    location: "",
    price_min: "",
    price_max: "",
    year_min: "",
    year_max: "",
  });

  const [brands, setBrands] = useState<string[]>([]);
  const [modelsByBrand, setModelsByBrand] = useState<Record<string, string[]>>({});
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    carService.getConstants()
      .then(({ data }) => {
        setBrands(data.brands);
        setModelsByBrand(data.models_by_brand);
        setLocations(data.locations);
      })
      .catch((err) => console.error("Failed to load car constants", err));
  }, []);
  const availableModels = filters.brand ? modelsByBrand[filters.brand] || [] : [];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    if (name === "brand") {
      newFilters.model = "";
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  return (
    <div className={styles.filterContainer}>
      <div className={styles.row}>
        <select name="brand" value={filters.brand} onChange={handleChange} className={styles.select}>
          <option value="">All Brands</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select name="model" value={filters.model} onChange={handleChange} className={styles.select} disabled={!filters.brand}>
          <option value="">All Models</option>
          {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select name="condition" value={filters.condition} onChange={handleChange} className={styles.select}>
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
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
    </div>
  );
};

export default CarFilterComponent;
