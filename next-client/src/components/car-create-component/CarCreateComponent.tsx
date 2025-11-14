"use client";

import React, { useEffect, useMemo, useState } from "react";
import { carService } from "@/lib/services/carService";
import styles from "./CarCreateComponent.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import { ICar, ICarPhoto } from "@/models/ICar";
import CarSelectsComponent from "@/components/car-selects-component/CarSelectsComponent";
import {AxiosResponse} from "axios";

type Currency = "UAH" | "USD" | "EUR";

const CarCreateComponent = () => {
  const [newCar, setNewCar] = useState<ICar>({
    id: "",
    brand: "",
    model: "",
    year: 0,
    mileage: 0,
    price: 0,
    currency: "UAH",
    price_usd: 0,
    price_eur: 0,
    condition: "new",
    max_speed: 0,
    seats_count: 0,
    engine_volume: 0,
    has_air_conditioner: false,
    fuel_type: "petrol",
    location: "",
    description: "",
    status: "",
    views: 0,
    daily_views: 0,
    weekly_views: 0,
    monthly_views: 0,
    created_at: "",
    updated_at: "",
    exchange_rate_id: "",
    last_exchange_update: null,
    photos: [],
  });
  const [exchangeRates, setExchangeRates] = useState<{ USD: number; EUR: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        const response = await carService.getExchangeRates();
        setExchangeRates(response.data);
      } catch (err) {
        console.error("Error fetching exchange rates:", err);
      }
    })();
  }, []);

  const convertedPrices = useMemo(() => {
    if (!exchangeRates) return { UAH: 0, USD: 0, EUR: 0 };
    const baseUAH =
      newCar.currency === "UAH"
        ? newCar.price
        : newCar.currency === "USD"
        ? newCar.price * exchangeRates.USD
        : newCar.price * exchangeRates.EUR;
    return {
      UAH: baseUAH,
      USD: baseUAH / exchangeRates.USD,
      EUR: baseUAH / exchangeRates.EUR,
    };
  }, [newCar.price, newCar.currency, exchangeRates]);


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setNewCar((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length + newCar.photos.length > 5) {
      setError("You can upload up to 5 photos.");
      return;
    }
    const newPhotos = files.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      car_id: "",
      photo_url: URL.createObjectURL(file),
    }));
    setNewCar((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));
    setError(null);
  };
  const handleDeletePhoto = (index: number) => {
    setNewCar((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleCreateCar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const carToSend: ICar = {
        ...newCar,
        price: convertedPrices[newCar.currency as Currency], // основна ціна
        price_usd: convertedPrices.USD,
        price_eur: convertedPrices.EUR,
      };
      const createdCar = (await carService.create(carToSend)) as AxiosResponse<ICar>;
      const carId = createdCar.data.id;
      if (newCar.photos.length > 0) {
        const photoArray: ICarPhoto[] = newCar.photos.map((photo, i) => ({
          id: `${Date.now()}-${i}`,
          car_id: carId,
          photo_url: photo.photo_url,
        }));
        await carService.addPhoto(carId, photoArray);
      }
      alert("New car listing created!");
      await router.push("/");
    } catch (err) {
      console.error(err);
      setError("Error creating car listing");
    }
  };

  return (
    <section className={styles.createCarSection}>
      <h2>Create a New Car Listing</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <form className={styles.createCarForm} onSubmit={handleCreateCar}>
        <CarSelectsComponent
          brand={newCar.brand}
          model={newCar.model}
          condition={newCar.condition}
          fuel_type={newCar.fuel_type}
          location={newCar.location}
          setBrand={(brand) => setNewCar((p) => ({ ...p, brand }))}
          setModel={(model) => setNewCar((p) => ({ ...p, model }))}
          setCondition={(condition) => setNewCar((p) => ({ ...p, condition }))}
          setFuelType={(fuel_type) => setNewCar((p) => ({ ...p, fuel_type }))}
          setLocation={(location) => setNewCar((p) => ({ ...p, location }))}
        />
        <input type="number" name="year" value={newCar.year} placeholder="Year" onChange={handleInputChange} />
        <input type="number" name="mileage" value={newCar.mileage} placeholder="Mileage" onChange={handleInputChange} />
        <input type="number" name="price" value={newCar.price} placeholder="Price" onChange={handleInputChange} />
        <select name="currency" value={newCar.currency} onChange={handleInputChange}>
          <option value="UAH">UAH</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        <p>Price in UAH: {convertedPrices.UAH.toFixed(2)}</p>
        <p>Price in USD: {convertedPrices.USD.toFixed(2)}</p>
        <p>Price in EUR: {convertedPrices.EUR.toFixed(2)}</p>
        <input type="number" name="max_speed" value={newCar.max_speed} placeholder="Max Speed" onChange={handleInputChange} />
        <input type="number" name="seats_count" value={newCar.seats_count} placeholder="Seats Count" onChange={handleInputChange} />
        <input type="number" name="engine_volume" value={newCar.engine_volume} placeholder="Engine Volume" onChange={handleInputChange} />
        <label>
          Air Conditioner:
          <input type="checkbox" name="has_air_conditioner" checked={newCar.has_air_conditioner} onChange={handleInputChange} />
        </label>
        <textarea name="description" value={newCar.description} placeholder="Description" onChange={handleInputChange} />
        <input type="file" multiple name="photos" onChange={handlePhotoChange} />
        {newCar.photos.length > 0 && (
          <div className={styles.photoPreview}>
            {newCar.photos.map((photo, i) => (
              <div key={i} className={styles.photoItem}>
                <Image src={photo.photo_url} alt="" width={150} height={100} />
                <button type="button" onClick={() => handleDeletePhoto(i)} className={styles.deletePhotoButton}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <button type="submit">Create Car Listing</button>
      </form>
    </section>
  );
};

export default CarCreateComponent;
