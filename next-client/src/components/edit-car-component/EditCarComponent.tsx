"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { carService } from "@/lib/services/carService";
import styles from './EditCarComponent.module.css';
import {useParams} from "next/navigation";

const EditCarComponent = () => {
  const { id } = useParams();  // Отримуємо ID машини з параметрів URL
  const router = useRouter();

  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    mileage: 0,
    price: 0,
    currency: 'USD',
    price_usd: 0,
    price_eur: 0,
    condition: 'new',
    max_speed: 0,
    seats_count: 0,
    engine_volume: 0,
    has_air_conditioner: false,
    fuel_type: 'petrol',
    location: '',
    description: '',
    status: 'active',
    photos: [],
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      carService.getById(id)
        .then((data) => {
          setCar(data); // Завантажуємо дані машини
        })
        .catch((err) => {
          setError('Error loading car details');
        });
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;

    setCar(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      if (id) {
        await carService.update(id, car); // Викликаємо API для оновлення даних машини
        alert('Car details updated!');
        router.push('/');  // Перехід на головну сторінку після збереження
      }
    } catch (err) {
      setError('Error saving car details');
    }
  };

  return (
    <section className={styles.editCarSection}>
      <h2>Edit Car Listing</h2>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form
        className={styles.editCarForm}
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveChanges();
        }}
      >
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={car.brand}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={car.model}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={car.year}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="mileage"
          placeholder="Mileage"
          value={car.mileage}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={car.price}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price_usd"
          placeholder="Price in USD"
          value={car.price_usd}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price_eur"
          placeholder="Price in EUR"
          value={car.price_eur}
          onChange={handleInputChange}
        />
        <select
          name="condition"
          value={car.condition}
          onChange={handleInputChange}
        >
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
        <input
          type="number"
          name="max_speed"
          placeholder="Max Speed"
          value={car.max_speed}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="seats_count"
          placeholder="Seats Count"
          value={car.seats_count}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="engine_volume"
          placeholder="Engine Volume (L)"
          value={car.engine_volume}
          onChange={handleInputChange}
        />
        <label>
          Air Conditioner:
          <input
            type="checkbox"
            name="has_air_conditioner"
            checked={car.has_air_conditioner}
            onChange={handleInputChange}
          />
        </label>
        <select
          name="fuel_type"
          value={car.fuel_type}
          onChange={handleInputChange}
        >
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="electric">Electric</option>
          <option value="hybrid">Hybrid</option>
        </select>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={car.location}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={car.description}
          onChange={handleInputChange}
        />
        <button type="submit">Save Changes</button>
      </form>
    </section>
  );
};

export default EditCarComponent;
