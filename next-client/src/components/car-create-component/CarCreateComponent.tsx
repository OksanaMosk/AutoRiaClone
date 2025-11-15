"use client";

import React, { useEffect, useMemo, useState } from "react";
import { carService } from "@/lib/services/carService";
import styles from "./CarCreateComponent.module.css";
import Image from "next/image";
import { ICar, ICarPhoto } from "@/models/ICar";
import CarSelectsComponent from "@/components/car-selects-component/CarSelectsComponent";
import userService from "@/lib/services/userService";
import {LoaderComponent} from "@/components/loader-component/LoaderComponent";

type Currency = "UAH" | "USD" | "EUR";

interface ILocalPhoto {
  file: File;
  preview_url: string;
}

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
    photos: [] as ICarPhoto[],
  });

  const [localPhotos, setLocalPhotos] = useState<ILocalPhoto[]>([]);
  const [exchangeRates, setExchangeRates] = useState<{ USD: number; EUR: number } | null>(null);
  const [message, setMessage] = useState("");
  const [loadingCar, setLoadingCar] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await carService.getExchangeRates();
        setExchangeRates(response.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const roundToDecimal = (value: number, decimals: number) =>
    Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);

  const convertedPrices = useMemo(() => {
    if (!exchangeRates || isNaN(newCar.price) || !newCar.currency) return { UAH: 0, USD: 0, EUR: 0 };
    const baseUAH =
      newCar.currency === "UAH"
        ? newCar.price
        : newCar.currency === "USD"
        ? newCar.price * (exchangeRates.USD || 0)
        : newCar.price * (exchangeRates.EUR || 0);
    const roundedUAH = roundToDecimal(baseUAH, 2);
    return {
      UAH: roundedUAH,
      USD: roundToDecimal(roundedUAH / (exchangeRates.USD || 1), 2),
      EUR: roundToDecimal(roundedUAH / (exchangeRates.EUR || 1), 2),
    };
  }, [newCar.price, newCar.currency, exchangeRates]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    let newValue = value;
    if (type === "number" || name === "year") newValue = value.replace(/[^0-9]/g, "");
    setNewCar((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : newValue }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (localPhotos.length + files.length > 5) {
      setMessage("You can upload up to 5 photos.");
      return;
    }
    const newPhotos: ILocalPhoto[] = files.map((file) => ({
      file,
      preview_url: URL.createObjectURL(file),
    }));
    setLocalPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleDeletePhoto = (index: number) => {
    setLocalPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateCarWithoutPhotos = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      "brand", "model", "year", "mileage", "price", "currency",
      "condition", "max_speed", "seats_count", "engine_volume", "fuel_type", "location", "description"
    ] as const;
    for (const field of requiredFields) {
      if (!newCar[field]) {
        setMessage(`Field "${field}" is required.`);
        return;
      }
    }

    setLoadingCar(true);
    try {
      const userId = localStorage.getItem("userId");
      const response = await userService.getUserCars(userId!);
      const cars: ICar[] = response.data;
      if (cars.length >= 1) {
        setMessage("Sorry, update account to Premium");
        setLoadingCar(false);
        return;
      }

      const carStatus = newCar.status || "pending";

      const carToSend: ICar = {
        ...newCar,
        status: carStatus,
        year: Number(newCar.year),
        mileage: Number(newCar.mileage),
        price: Number(convertedPrices[newCar.currency as Currency]),
        price_usd: Number(convertedPrices.USD),
        price_eur: Number(convertedPrices.EUR),
        engine_volume: Number(newCar.engine_volume),
        max_speed: Number(newCar.max_speed),
        seats_count: Number(newCar.seats_count),
        last_exchange_update: newCar.last_exchange_update
          ? new Date(newCar.last_exchange_update).toISOString().split("T")[0]
          : null,
        photos: [],
      };

      const createdCar = await carService.create(carToSend);
      setNewCar((prev) => ({ ...prev, id: createdCar.data.id }));

      if (createdCar.data.status === "pending") {
        setMessage("Your car listing contains inappropriate language. Please edit the description.");
        setLoadingCar(false);
        return;
      }

      if (createdCar.data.status === "inactive") {
        setMessage("You have failed to edit your description 3 times. The ad has been deactivated.");
        setLoadingCar(false);
        return;
      }

      setMessage("Car created successfully! You can add photos now.");
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data || "Error creating car listing");
    } finally {
      setLoadingCar(false);
    }
  };

  const handleAddPhotos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCar.id) return setMessage("Create a car first.");
    if (localPhotos.length === 0) return setMessage("Add at least one photo.");

    setLoadingPhotos(true);
    try {
      for (const p of localPhotos) {
        const formData = new FormData();
        formData.append("photo", p.file);
        formData.append("car", newCar.id.toString());
        await carService.addPhoto(newCar.id, formData);
      }
      setMessage("Photos uploaded successfully!");
      setLocalPhotos([]);
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Error uploading photos");
    } finally {
      setLoadingPhotos(false);
    }
  };

  return (
    <section className={styles.userManagement}>
      <h3 className={styles.subtitle}>Create New Car</h3>

      {message && <div className={styles.errorMessage}>{message}</div>}

      <form onSubmit={handleCreateCarWithoutPhotos}>
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

          <div className={styles.topSection}>
              <div className={styles.choiceSection}>
                  <div className={styles.inputSection}>
                      <label className={styles.label}>Year*</label>
                      <input type="number" name="year" value={newCar.year || ""} onChange={handleInputChange} required
                             className={styles.select}/>
                  </div>

                  <div className={styles.inputSection}>
                      <label className={styles.label}>Mileage*</label>
                      <input type="number" name="mileage" value={newCar.mileage || ""} onChange={handleInputChange}
                             required
                             className={styles.select}/>
                  </div>
                  <div className={styles.inputSection}>
                      <label className={styles.label}>Seats Count*</label>
                      <input type="number" name="seats_count" value={newCar.seats_count || ""}
                             onChange={handleInputChange}
                             required className={styles.select}/>
                  </div>
              </div>
              <div className={styles.choiceSection}>
                  <div className={styles.inputSection}>
                      <label className={styles.label}>Max Speed*</label>
                      <input type="number" name="max_speed" value={newCar.max_speed || ""} onChange={handleInputChange}
                             required
                             className={styles.select}/>
                  </div>

                  <div className={styles.inputSection}>
                      <label className={styles.label}>Engine Volume*</label>
                      <input type="number" name="engine_volume" value={newCar.engine_volume || ""}
                             onChange={handleInputChange}
                             required className={styles.select}/>
                  </div>
                  <label className={styles.label}>
                      Air Conditioner:
                      <input type="checkbox" name="has_air_conditioner" checked={newCar.has_air_conditioner}
                             onChange={handleInputChange} className={styles.select}/>
                  </label>
              </div>
          </div>
          
          <div className={styles.inputSection}>
              <label className={styles.label}>Price*</label>
              <input type="number" name="price" value={newCar.price || ""} onChange={handleInputChange} required
                     className={styles.select}/>
          </div>

        <label className={styles.label}>Currency*</label>
        <select name="currency" value={newCar.currency} onChange={handleInputChange} required className={styles.select}>
          <option value="UAH">UAH</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>

        <div className={styles.select}>
          Price in UAH: {convertedPrices.UAH.toFixed(2)} | USD: {convertedPrices.USD.toFixed(2)} | EUR: {convertedPrices.EUR.toFixed(2)}
        </div>

         

      

          <div className={styles.textarea}>
              <label className={styles.label}>Description*</label>
              <textarea name="description" value={newCar.description} onChange={handleInputChange} required
                        className={styles.select}/>
          </div>



        <button type="submit" disabled={loadingCar} className={styles.submitButton}>
          {loadingCar ? <LoaderComponent/> : "Save"}
        </button>
      </form>

      <form onSubmit={handleAddPhotos}>
        <label className={styles.label}>Upload Photos (Max 5)*</label>
        <input type="file" multiple onChange={handlePhotoChange} disabled={loadingPhotos || localPhotos.length >= 5} className={styles.select} />

        {localPhotos.length > 0 && (
          <div className={styles.table}>
            {localPhotos.map((photo, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Image src={photo.preview_url} alt="" width={100} height={70} />
                <button type="button" onClick={() => handleDeletePhoto(i)} className={styles.deleteButton}>Delete</button>
              </div>
            ))}
          </div>
        )}

        {newCar.id && (
          <button type="submit" disabled={loadingPhotos} className={styles.submitButton}>
            {loadingPhotos ? <LoaderComponent/> : "Add Photos"}
          </button>
        )}
      </form>
    </section>
  );
};

export default CarCreateComponent;

