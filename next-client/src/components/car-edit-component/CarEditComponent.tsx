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
  const [exchangeRates, setExchangeRates] = useState<{ USD: number; EUR: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message] = useState("");
  const [localPhotos, setLocalPhotos] = useState<ICarPhoto[]>([]); // існуючі фотки
const [newFiles, setNewFiles] = useState<File[]>([]);
const [loadingPhotos, setLoadingPhotos] = useState(false);

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
        setForm(data);
         setLocalPhotos(data.photos || []);
        setExchangeRates(ratesResponse.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load car");
    } finally {
      setLoading(false);
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
  useEffect(() => {
  if (form?.photos) setLocalPhotos(form.photos);
}, [form]);

const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;
  const filesArray = Array.from(e.target.files).slice(0, 5 - localPhotos.length);
  setNewFiles(filesArray);
};
const handleDeletePhoto = async (id: string) => {
  try {
    await carService.deletePhoto(id);
    setLocalPhotos((prev) => prev.filter((p) => p.id !== id));
  } catch (err) {
    console.error(err);
    alert("Failed to delete photo");
  }
};
const handleAddPhotos = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newFiles.length) return;
  setLoadingPhotos(true);
  try {
    const formData = new FormData();
    newFiles.forEach((file) => formData.append("photos", file));
    const added = await carService.addPhoto(carId, formData);
    setLocalPhotos((prev) => [...prev, ...added.data]);
    setNewFiles([]);
  } catch (err) {
    console.error(err);
    alert("Failed to upload photos");
  } finally {
    setLoadingPhotos(false);
  }
};
  if (loading || !form) return <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
            <LoaderComponent />
        </div>;
  return (
    <section className={styles.wrapper}>
      <h3 className={styles.subtitle}>Edit Car #{carId}</h3>
      <form className={styles.form} onSubmit={handleSubmit}>
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
           {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.success}>{message}</p>}
          <button type="submit" disabled={saving} className={styles.submitButton}>
              {saving ? <div className={`authButton ${styles.loaderWrapper}`}>
                  <LoaderComponent/>
              </div> : "Save Changes"}
          </button>
      </form>
        <form onSubmit={handleAddPhotos} className={styles.photoWrapper}>
            <label className={styles.photoLabel}>Upload Photos (Max 5)*</label>
            <input type="file" multiple onChange={handlePhotoChange}
                   disabled={loadingPhotos || localPhotos.length + newFiles.length >= 5} className={styles.input}/>
            <div  className={styles.photoContainer}>
                <div className={styles.photoArray}>
                    {localPhotos.map((p) => (
                        <div className={styles.photo} key={p.id}>
                            <Image src={p.photo} alt="" width={140} height={100}/>
                            <button type="button" onClick={() => handleDeletePhoto(p.id)}
                                    className={styles.deleteButton}>
                                Delete
                            </button>
                        </div>
                    ))}
                    {newFiles.map((file, i) => (
                        <div className={styles.photo} key={i}>
                            <Image src={URL.createObjectURL(file)} alt="" width={140} height={100}/>
                            <button type="button"
                                    onClick={() => setNewFiles((prev) => prev.filter((_, idx) => idx !== i))}
                                    className={styles.deleteButton}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            {newFiles.length > 0 && (
                <button type="submit" disabled={loadingPhotos} className={styles.submitButton}>
                    {loadingPhotos ? <LoaderComponent/> : "Add Photos"}
                </button>
            )}
        </form>
    </section>
  );
};

export default CarEditComponent;
