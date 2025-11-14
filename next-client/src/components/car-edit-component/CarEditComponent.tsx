"use client";

import React, { useEffect, useState } from "react";
import { carService } from "@/lib/services/carService";
import styles from './CarEditComponent.module.css';
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import CarSelectsComponent from "@/components/car-selects-component/CarSelectsComponent";
import { ICar, ICarPhoto } from "@/models/ICar";
import Image from "next/image";
import {LoaderComponent} from "@/components/loader-component/LoaderComponent";

type Currency = "UAH" | "USD" | "EUR";

const CarEditComponent: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const router = useRouter();

  const [form, setForm] = useState<Partial<ICar>>({
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
  });

  const [photos, setPhotos] = useState<ICarPhoto[]>([]);
  const [exchangeRates, setExchangeRates] = useState<{ USD: number; EUR: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Завантаження авто
  useEffect(() => {
    if (!carId) return;

    setLoading(true);
    carService.get(carId)
      .then(res => {
        const data: ICar = res.data;
        setForm({
          brand: data.brand,
          model: data.model,
          year: data.year,
          mileage: data.mileage,
          price: data.price,
          currency: data.currency,
          price_usd: data.price_usd,
          price_eur: data.price_eur,
          condition: data.condition,
          max_speed: data.max_speed,
          seats_count: data.seats_count,
          engine_volume: data.engine_volume,
          has_air_conditioner: data.has_air_conditioner,
          fuel_type: data.fuel_type,
          location: data.location,
          description: data.description,
        });
        setPhotos(data.photos || []);
      })
      .catch(err => console.error("Failed to load car:", err))
      .finally(() => setLoading(false));
  }, [carId]);

  // Завантаження курсів валют
  useEffect(() => {
    (async () => {
      try {
        const res = await carService.getExchangeRates();
        setExchangeRates(res.data);
      } catch (err) {
        console.error("Failed to load exchange rates:", err);
      }
    })();
  }, []);

  // Конвертація цін
  const convertedPrices = React.useMemo(() => {
    if (!exchangeRates) return { UAH: 0, USD: 0, EUR: 0 };
    const baseUAH =
      form.currency === "UAH"
        ? form.price || 0
        : form.currency === "USD"
        ? (form.price || 0) * exchangeRates.USD
        : (form.price || 0) * exchangeRates.EUR;
    return {
      UAH: baseUAH,
      USD: baseUAH / exchangeRates.USD,
      EUR: baseUAH / exchangeRates.EUR,
    };
  }, [form.price, form.currency, exchangeRates]);

  // Зміни у формі
  const handleChange = (
    field: keyof ICar,
    value: string | number | boolean
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Додавання фото
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length + photos.length > 5) {
      setError("You can upload up to 5 photos.");
      return;
    }
    const newPhotos = files.map((file, i) => ({
      id: `temp-${Date.now()}-${i}`,
      car_id: carId || "",
      photo_url: URL.createObjectURL(file),
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
    setError(null);
  };

  const handleDeletePhoto = async (photo: ICarPhoto, index: number) => {
    try {
      if (!photo.id.startsWith("temp-")) {
        await carService.deletePhoto(photo.id);
      }
      setPhotos(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Failed to delete photo:", err);
      setError("Failed to delete photo");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!carId) return;

      const carToSend: ICar = {
        ...form,
        price: convertedPrices[form.currency as Currency],
        price_usd: convertedPrices.USD,
        price_eur: convertedPrices.EUR,
        photos: [],
      } as ICar;

      await carService.update(carId, carToSend);

      const newPhotos = photos.filter(p => p.id.startsWith("temp-"));
      if (newPhotos.length > 0) {
        await carService.addPhoto(carId, newPhotos);
      }

      await router.push("/");
    } catch (err) {
      console.error(err);
      setError("Failed to save car");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p><LoaderComponent/></p>;

  return (
    <section className={styles.editCarSection}>
      <h2>Edit Car Listing</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <form className={styles.editCarForm} onSubmit={handleSubmit}>
        <CarSelectsComponent
          brand={form.brand || ""}
          model={form.model || ""}
          condition={form.condition || "new"}
          fuel_type={form.fuel_type || "petrol"}
          location={form.location || ""}
          setBrand={(v) => handleChange("brand", v)}
          setModel={(v) => handleChange("model", v)}
          setCondition={(v) => handleChange("condition", v)}
          setFuelType={(v) => handleChange("fuel_type", v)}
          setLocation={(v) => handleChange("location", v)}
        />

        <input type="number" value={form.year || 0} placeholder="Year" onChange={e => handleChange("year", Number(e.target.value))} />
        <input type="number" value={form.mileage || 0} placeholder="Mileage" onChange={e => handleChange("mileage", Number(e.target.value))} />
        <input type="number" value={form.price || 0} placeholder="Price" onChange={e => handleChange("price", Number(e.target.value))} />

        <select value={form.currency} onChange={e => handleChange("currency", e.target.value)}>
          <option value="UAH">UAH</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>

        <p>Price in UAH: {convertedPrices.UAH.toFixed(2)}</p>
        <p>Price in USD: {convertedPrices.USD.toFixed(2)}</p>
        <p>Price in EUR: {convertedPrices.EUR.toFixed(2)}</p>

        <input type="number" value={form.max_speed || 0} placeholder="Max Speed" onChange={e => handleChange("max_speed", Number(e.target.value))} />
        <input type="number" value={form.seats_count || 0} placeholder="Seats Count" onChange={e => handleChange("seats_count", Number(e.target.value))} />
        <input type="number" value={form.engine_volume || 0} placeholder="Engine Volume" onChange={e => handleChange("engine_volume", Number(e.target.value))} />

        <label>
          Air Conditioner:
          <input type="checkbox" checked={form.has_air_conditioner || false} onChange={e => handleChange("has_air_conditioner", e.target.checked)} />
        </label>

        <textarea value={form.description || ""} placeholder="Description" onChange={e => handleChange("description", e.target.value)} />

        <input type="file" multiple onChange={handlePhotoChange} />
        {photos.length > 0 && (
          <div className={styles.photoPreview}>
            {photos.map((photo, i) => (
              <div key={i} className={styles.photoItem}>
                <Image src={photo.photo_url} alt="" width={150} height={100} />
                <button type="button" onClick={() => handleDeletePhoto(photo, i)}>Delete</button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Car"}
        </button>
      </form>
    </section>
  );
};

export default CarEditComponent;

