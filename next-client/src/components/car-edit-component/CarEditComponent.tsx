"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { carService } from "@/lib/services/carService";
import CarSelectsComponent from "@/components/car-selects-component/CarSelectsComponent";
import { LoaderComponent } from "@/components/loader-component/LoaderComponent";
import { ICar, ICarPhoto } from "@/models/ICar";
import styles from "./CarEditComponent.module.css";

interface CarEditComponentProps {
  carId: string;
}

const CarEditComponent = ({ carId }: CarEditComponentProps) => {
  const router = useRouter();

  const [form, setForm] = useState<Partial<ICar> | null>(null);
  const [photos, setPhotos] = useState<ICarPhoto[]>([]);
  const [exchangeRates, setExchangeRates] = useState<{ USD: number; EUR: number } | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message] = useState("");

  useEffect(() => {
  if (!carId) return;

  setLoading(true);
  (async () => {
    try {
      const [carResponse, ratesResponse] = await Promise.all([
        carService.get(carId),
        carService.getExchangeRates(),
      ]);

      const data: ICar = carResponse.data;
      const userId = localStorage.getItem("userId");

      // if ("seller_id" in data && data.seller_id !== userId) {
      //   setError("You cannot edit this car. It does not belong to you.");
      // } else {
        setForm(data);
        setPhotos(data.photos || []);
        setExchangeRates(ratesResponse.data);
      // }
    } catch (err) {
      console.error(err);
      setError("Failed to load car");
    } finally {
      setLoading(false); // завжди виконуємо
    }
  })();
}, [carId]);


  const convertedPrices = useMemo(() => {
    if (!form || !exchangeRates || isNaN(Number(form.price))) {
      return { UAH: 0, USD: 0, EUR: 0 };
    }

    const price = Number(form.price);
    const currency = form.currency || "UAH";

    const baseUAH =
      currency === "UAH"
        ? price
        : currency === "USD"
        ? price * exchangeRates.USD
        : price * exchangeRates.EUR;

    return {
      UAH: baseUAH,
      USD: baseUAH / exchangeRates.USD,
      EUR: baseUAH / exchangeRates.EUR,
    };
  }, [form, exchangeRates]);

  const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const target = e.target;
  const { name } = target;
  let newValue: string | number | boolean = target.value;
  if (target instanceof HTMLInputElement && target.type === "checkbox") {
    newValue = target.checked;
  }
  if (target instanceof HTMLInputElement && target.type === "number") {
    newValue = Number(newValue);
  }
  setForm((prev) => ({
    ...prev!,
    [name]: newValue,
  }));
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setError(null);

    try {
      const updated: ICar = {
        ...form,
        price: convertedPrices[form.currency as keyof typeof convertedPrices],
        price_usd: convertedPrices.USD,
        price_eur: convertedPrices.EUR,
      } as ICar;

      await carService.update(carId, updated);
      router.push("/cars");
    } catch (err) {
      console.error(err);
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };


  if (loading || !form) return <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
            <LoaderComponent />
        </div>;

  return (
    <section className={styles.wrapper}>
      <h3 className={styles.subtitle}>Edit Car #{carId}</h3>

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* SELECTS */}
          <CarSelectsComponent
              brand={form.brand ?? ""}
              model={form.model ?? ""}
              condition={form.condition ?? ""}
              fuel_type={form.fuel_type ?? ""}
              location={form.location ?? ""}
              setBrand={(brand) => setForm((p) => ({...p!, brand}))}
              setModel={(model) => setForm((p) => ({...p!, model}))}
              setCondition={(condition) => setForm((p) => ({ ...p!, condition }))}
          setFuelType={(fuel_type) => setForm((p) => ({ ...p!, fuel_type }))}
          setLocation={(location) => setForm((p) => ({ ...p!, location }))}
        />

        <div className={styles.topSection}>
          <div className={styles.choiceSection}>
            <div className={styles.inputSection}>
              <label className={styles.label}>Year*</label>
              <input name="year" type="number" value={form.year} onChange={handleInputChange} className={styles.input} />
            </div>

            <div className={styles.inputSection}>
              <label className={styles.label}>Mileage*</label>
              <input name="mileage" type="number" value={form.mileage} onChange={handleInputChange} className={styles.input} />
            </div>

            <div className={styles.inputSection}>
              <label className={styles.label}>Seats Count*</label>
              <input name="seats_count" type="number" value={form.seats_count} onChange={handleInputChange} className={styles.input} />
            </div>
          </div>

          <div className={styles.choiceSection}>
            <div className={styles.inputSection}>
              <label className={styles.label}>Max Speed*</label>
              <input name="max_speed" type="number" value={form.max_speed} onChange={handleInputChange} className={styles.input} />
            </div>

            <div className={styles.inputSection}>
              <label className={styles.label}>Engine*</label>
              <input name="engine_volume" type="number" value={form.engine_volume} onChange={handleInputChange} className={styles.input} />
            </div>

            <label className={styles.label}>
              AC
              <input
                type="checkbox"
                name="has_air_conditioner"
                checked={Boolean(form.has_air_conditioner)}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
            </label>
          </div>
        </div>

        <div className={styles.priceSection}>
          <div className={styles.inputSection}>
            <label className={styles.label}>Price*</label>
            <input name="price" type="number" value={form.price} onChange={handleInputChange} className={styles.input} />
          </div>

          <div className={styles.inputSection}>
            <label className={styles.label}>Currency*</label>
            <select name="currency" value={form.currency} onChange={handleInputChange} className={styles.select}>
              <option value="UAH">UAH</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        {exchangeRates && (
          <div className={styles.rate}>
            1 USD = {exchangeRates.USD} UAH | 1 EUR = {exchangeRates.EUR} UAH
          </div>
        )}

        <div className={styles.rate}>
          Price in UAH: {convertedPrices.UAH.toFixed(2)} |
          USD: {convertedPrices.USD.toFixed(2)} |
          EUR: {convertedPrices.EUR.toFixed(2)}
        </div>

        <div className={styles.textareaWrapper}>
          <label className={styles.label}>Description*</label>
          <textarea name="description" value={form.description} onChange={handleInputChange} className={styles.textarea} />
        </div>
        {message && <p className={styles.success}>{message}</p>}
        <button type="submit" disabled={saving} className={styles.submitButton}>
          {saving ?  <div className={`authButton ${styles.loaderWrapper}`}>
              <LoaderComponent />
            </div> : "Save Changes"}
        </button>
      </form>


            <div className={styles.photoContainer}>
                {photos && photos.map((p) => (
                    <Image
                        key={p.id}
                        src={`${p.photo}`}
                        alt="car photo"
                        width={140}
                        height={100}
                         unoptimized={true}
                    />
                ))}

            </div>

    </section>
  );
};

export default CarEditComponent;
