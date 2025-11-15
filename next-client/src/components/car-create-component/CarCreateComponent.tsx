"use client";

import React, { useEffect, useMemo, useState } from "react";
import { carService } from "@/lib/services/carService";
import styles from "./CarCreateComponent.module.css";
import Image from "next/image";
import { ICar, ICarPhoto } from "@/models/ICar";
import CarSelectsComponent from "@/components/car-selects-component/CarSelectsComponent";
import { AxiosResponse } from "axios";

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

  const roundToDecimal = (value: number, decimals: number) => {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  };

  const convertedPrices = useMemo(() => {
    if (!exchangeRates || isNaN(newCar.price) || !newCar.currency) {
      return { UAH: 0, USD: 0, EUR: 0 };
    }

    const baseUAH =
      newCar.currency === "UAH"
        ? Number(newCar.price)
        : newCar.currency === "USD"
        ? Number(newCar.price) * (exchangeRates.USD || 0)
        : Number(newCar.price) * (exchangeRates.EUR || 0);

    const roundedBaseUAH = roundToDecimal(baseUAH, 2);
    const roundedUSD = roundToDecimal(roundedBaseUAH / (exchangeRates.USD || 1), 2);
    const roundedEUR = roundToDecimal(roundedBaseUAH / (exchangeRates.EUR || 1), 2);

    return {
      UAH: roundedBaseUAH || 0,
      USD: roundedUSD || 0,
      EUR: roundedEUR || 0,
    };
  }, [newCar.price, newCar.currency, exchangeRates]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    let newValue = value;

    if (type === "number" || name === "year") {
      newValue = value.replace(/[^0-9]/g, "");
      newValue = newValue === "" ? "" : newValue; // Ensure empty string instead of "0"
    }

    setNewCar((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
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
      car_id: newCar.id || "",
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

  const handleCreateCarWithoutPhotos = async (e: React.FormEvent) => {
    e.preventDefault();
      const carStatus = newCar.status || "pending";
      try {
          const carToSend: ICar = {
              ...newCar,
              year: Number(newCar.year),
              status: carStatus,
              mileage: Number(newCar.mileage),
              price: Number(convertedPrices[newCar.currency as Currency]),
              price_usd: Number(convertedPrices.USD),
              price_eur: Number(convertedPrices.EUR),
              engine_volume: Number(newCar.engine_volume),
              max_speed: Number(newCar.max_speed),
              seats_count: Number(newCar.seats_count),
              last_exchange_update: newCar.last_exchange_update ? new Date(newCar.last_exchange_update).toISOString().split('T')[0] : null,
              photos: [],
          };

   console.log("Car data being sent:", carToSend);
      const createdCar = (await carService.create(carToSend)) as AxiosResponse<ICar>;
      const carId = createdCar.data.id;

      setNewCar((prev) => ({ ...prev, id: carId }));

      if (createdCar.data.status === "pending") {
        alert("Your car listing contains inappropriate language. Please edit the description.");
        return;
      }

      if (createdCar.data.status === "inactive") {
        alert("You have failed to edit your description 3 times. The ad has been deactivated.");
        return;
      }

      alert("Car listing created without photos. Now you can add photos.");
    } catch (err) {
    console.error("Error creating car:", err.response?.data || err.message);
      setError("Error creating car listing");
    }
  };

  const handleAddPhotos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCar.id) {
      alert("Please create a car first before adding photos.");
      return;
    }

    try {
      const photoArray: ICarPhoto[] = newCar.photos.map((photo) => ({
        id: `${Date.now()}-${Math.random()}`,
        car_id: newCar.id,
        photo_url: photo.photo_url,
      }));

      await carService.addPhoto(newCar.id, photoArray);

      alert("Photos added to car listing successfully!");
    } catch (err) {
      console.error("Error adding photos:", err);
      setError("Error adding photos");
    }
  };

  return (
    <section className={styles.createCarSection}>
      <h2>Create a New Car Listing</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Form for creating a car without photos */}
      <form className={styles.createCarForm} onSubmit={handleCreateCarWithoutPhotos}>
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
        <input
          type="text"
          name="year"
          value={newCar.year}
          placeholder="Year (e.g. 2022)"
          onChange={handleInputChange}
          className={styles.inputField}
        />
        <input
          type="number"
          name="mileage"
          value={newCar.mileage || ""}
          placeholder="Mileage (km)"
          onChange={handleInputChange}
          className={styles.inputField}
        />
        <input
          type="number"
          name="price"
          value={newCar.price || ""}
          placeholder="Price"
          onChange={handleInputChange}
          className={styles.inputField}
        />
        <select
          name="currency"
          value={newCar.currency}
          onChange={handleInputChange}
          className={styles.inputField}
        >
          <option value="UAH">UAH</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>

          <div className={styles.currencyDisplay}>
              <div>Price in UAH: {convertedPrices.UAH.toFixed(2)}</div>
              <div>Price in USD: {convertedPrices.USD.toFixed(2)}</div>
              <div>Price in EUR: {convertedPrices.EUR.toFixed(2)}</div>
          </div>

        <input
          type="number"
          name="max_speed"
          value={newCar.max_speed || ""}
          placeholder="Max Speed (km/h)"
          onChange={handleInputChange}
          className={styles.inputField}
        />
        <input
          type="number"
          name="seats_count"
          value={newCar.seats_count || ""}
          placeholder="Seats Count"
          onChange={handleInputChange}
          className={styles.inputField}
        />
        <input
          type="number"
          name="engine_volume"
          value={newCar.engine_volume || ""}
          placeholder="Engine Volume (L)"
          onChange={handleInputChange}
          className={styles.inputField}
        />
        <label>
          Air Conditioner:
          <input
            type="checkbox"
            name="has_air_conditioner"
            checked={newCar.has_air_conditioner}
            onChange={handleInputChange}
            className={styles.checkboxField}
          />
        </label>
        <textarea
          name="description"
          value={newCar.description}
          placeholder="Description"
          onChange={handleInputChange}
          className={styles.textareaField}
        />
        <button type="submit" className={styles.submitButton}>
          Create Car Listing Without Photos
        </button>
      </form>

      {/* Form for adding photos */}
      <form className={styles.createCarForm} onSubmit={handleAddPhotos}>
        <input
          type="file"
          multiple
          name="photos"
          onChange={handlePhotoChange}
          className={styles.fileInput}
        />
        {newCar.photos.length > 0 && (
          <div className={styles.photoPreview}>
            {newCar.photos.map((photo, i) => (
              <div key={i} className={styles.photoItem}>
                <Image src={photo.photo_url} alt="" width={150} height={100} />
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(i)}
                  className={styles.deletePhotoButton}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        {newCar.id && (
          <button type="submit" className={styles.submitButton}>
            Add Photos to Car Listing
          </button>
        )}
      </form>
    </section>
  );
};

export default CarCreateComponent;
















// "use client";
//
// import React, { useEffect, useMemo, useState } from "react";
// import { carService } from "@/lib/services/carService";
// import styles from "./CarCreateComponent.module.css";
// import Image from "next/image";
// import { ICar, ICarPhoto } from "@/models/ICar";
// import CarSelectsComponent from "@/components/car-selects-component/CarSelectsComponent";
// import { AxiosResponse } from "axios";
//
// type Currency = "UAH" | "USD" | "EUR";
//
// const CarCreateComponent = () => {
//   const [newCar, setNewCar] = useState<ICar>({
//     id: "",
//     brand: "",
//     model: "",
//     year: 0,
//     mileage: 0,
//     price: 0,
//     currency: "UAH",
//     price_usd: 0,
//     price_eur: 0,
//     condition: "new",
//     max_speed: 0,
//     seats_count: 0,
//     engine_volume: 0,
//     has_air_conditioner: false,
//     fuel_type: "petrol",
//     location: "",
//     description: "",
//     status: "",
//     views: 0,
//     daily_views: 0,
//     weekly_views: 0,
//     monthly_views: 0,
//     created_at: "",
//     updated_at: "",
//     exchange_rate_id: "",
//     last_exchange_update: null,
//     photos: [],
//   });
//
//   const [exchangeRates, setExchangeRates] = useState<{ USD: number; EUR: number } | null>(null);
//   const [error, setError] = useState<string | null>(null);
//
//   useEffect(() => {
//     (async () => {
//       try {
//         const response = await carService.getExchangeRates();
//         setExchangeRates(response.data);
//       } catch (err) {
//         console.error("Error fetching exchange rates:", err);
//       }
//     })();
//   }, []);
//
//   const convertedPrices = useMemo(() => {
//     if (!exchangeRates || isNaN(newCar.price) || !newCar.currency) {
//       return { UAH: 0, USD: 0, EUR: 0 };
//     }
//
//     const baseUAH =
//       newCar.currency === "UAH"
//         ? Number(newCar.price)
//         : newCar.currency === "USD"
//         ? Number(newCar.price) * (exchangeRates.USD || 0)
//         : Number(newCar.price) * (exchangeRates.EUR || 0);
//
//     const roundedBaseUAH = Math.round(baseUAH * 100) / 100;
//     const roundedUSD = Math.round(roundedBaseUAH / (exchangeRates.USD || 1) * 100) / 100;
//     const roundedEUR = Math.round(roundedBaseUAH / (exchangeRates.EUR || 1) * 100) / 100;
//
//     return {
//       UAH: roundedBaseUAH || 0,
//       USD: roundedUSD || 0,
//       EUR: roundedEUR || 0,
//     };
//   }, [newCar.price, newCar.currency, exchangeRates]);
//
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type, checked } = e.target as HTMLInputElement;
//     setNewCar((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };
//
//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     const files = Array.from(e.target.files);
//     if (files.length + newCar.photos.length > 5) {
//       setError("You can upload up to 5 photos.");
//       return;
//     }
//     const newPhotos = files.map((file, i) => ({
//       id: `${Date.now()}-${i}`,
//       car_id: newCar.id || "",
//       photo_url: URL.createObjectURL(file),
//     }));
//     setNewCar((prev) => ({
//       ...prev,
//       photos: [...prev.photos, ...newPhotos],
//     }));
//     setError(null);
//   };
//
//   const handleDeletePhoto = (index: number) => {
//     setNewCar((prev) => ({
//       ...prev,
//       photos: prev.photos.filter((_, i) => i !== index),
//     }));
//   };
//
//   // Створення автомобіля без фотографій
//   const handleCreateCarWithoutPhotos = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const carToSend: ICar = {
//         ...newCar,
//         price: convertedPrices[newCar.currency as Currency],
//         price_usd: convertedPrices.USD,
//         price_eur: convertedPrices.EUR,
//         photos: [], // без фотографій
//       };
// console.log("Car to send:", carToSend);
//       const createdCar = (await carService.create(carToSend)) as AxiosResponse<ICar>;
//       const carId = createdCar.data.id;
//
//       // Оновлюємо стан з отриманим id
//       setNewCar((prev) => ({ ...prev, id: carId }));
//
//       if (createdCar.data.status === 'pending') {
//         alert("Your car listing contains inappropriate language. Please edit the description.");
//         return;
//       }
//
//       if (createdCar.data.status === 'inactive') {
//         alert("You have failed to edit your description 3 times. The ad has been deactivated.");
//         return;
//       }
//
//       alert("Car listing created without photos. Now you can add photos.");
//     } catch (err) {
//       console.error(err);
//       setError("Error creating car listing");
//     }
//   };
//
//   const handleAddPhotos = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!newCar.id) {
//     alert("Please create a car first before adding photos.");
//     return;
//   }
//
//   try {
//     const photoArray: ICarPhoto[] = newCar.photos.map((photo) => ({
//       id: `${Date.now()}-${Math.random()}`, // Генерація унікального ID для кожної фотографії
//       car_id: newCar.id,
//       photo_url: photo.photo_url,
//     }));
//
//     await carService.addPhoto(newCar.id, photoArray);
//
//     alert("Photos added to car listing successfully!");
//   } catch (err) {
//     console.error("Error adding photos:", err);
//     setError("Error adding photos");
//   }
// };
//
//   return (
//     <section className={styles.createCarSection}>
//       <h2>Create a New Car Listing</h2>
//       {error && <div className={styles.errorMessage}>{error}</div>}
//
//       {/* Форма для створення автомобіля без фотографій */}
//       <form className={styles.createCarForm} onSubmit={handleCreateCarWithoutPhotos}>
//         <CarSelectsComponent
//           brand={newCar.brand}
//           model={newCar.model}
//           condition={newCar.condition}
//           fuel_type={newCar.fuel_type}
//           location={newCar.location}
//           setBrand={(brand) => setNewCar((p) => ({ ...p, brand }))}
//           setModel={(model) => setNewCar((p) => ({ ...p, model }))}
//           setCondition={(condition) => setNewCar((p) => ({ ...p, condition }))}
//           setFuelType={(fuel_type) => setNewCar((p) => ({ ...p, fuel_type }))}
//           setLocation={(location) => setNewCar((p) => ({ ...p, location }))}
//         />
//         <input type="number" name="year" value={newCar.year} placeholder="Year" onChange={handleInputChange} />
//         <input type="number" name="mileage" value={newCar.mileage} placeholder="Mileage" onChange={handleInputChange} />
//         <input type="number" name="price" value={newCar.price} placeholder="Price" onChange={handleInputChange} />
//         <select name="currency" value={newCar.currency} onChange={handleInputChange}>
//           <option value="UAH">UAH</option>
//           <option value="USD">USD</option>
//           <option value="EUR">EUR</option>
//         </select>
//
//         <p className={styles.priceItem}>Price in UAH: {convertedPrices.UAH.toFixed(2)}</p>
//         <p className={styles.priceItem}>Price in USD: {convertedPrices.USD.toFixed(2)}</p>
//         <p className={styles.priceItem}>Price in EUR: {convertedPrices.EUR.toFixed(2)}</p>
//
//         <input type="number" name="max_speed" value={newCar.max_speed} placeholder="Max Speed" onChange={handleInputChange} />
//         <input type="number" name="seats_count" value={newCar.seats_count} placeholder="Seats Count" onChange={handleInputChange} />
//         <input type="number" name="engine_volume" value={newCar.engine_volume} placeholder="Engine Volume" onChange={handleInputChange} />
//         <label>
//           Air Conditioner:
//           <input type="checkbox" name="has_air_conditioner" checked={newCar.has_air_conditioner} onChange={handleInputChange} />
//         </label>
//         <textarea name="description" value={newCar.description} placeholder="Description" onChange={handleInputChange} />
//         <button type="submit">Create Car Listing Without Photos</button>
//       </form>
//
//       {/* Форма для додавання фотографій */}
//       <form className={styles.createCarForm} onSubmit={handleAddPhotos}>
//         <input type="file" multiple name="photos" onChange={handlePhotoChange} />
//         {newCar.photos.length > 0 && (
//           <div className={styles.photoPreview}>
//             {newCar.photos.map((photo, i) => (
//               <div key={i} className={styles.photoItem}>
//                 <Image src={photo.photo_url} alt="" width={150} height={100} />
//                 <button type="button" onClick={() => handleDeletePhoto(i)} className={styles.deletePhotoButton}>
//                   Delete
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//         {newCar.id && <button type="submit">Add Photos to Car Listing</button>}
//       </form>
//     </section>
//   );
// };
//
// export default CarCreateComponent;
//


// "use client";
//
// import React, { useEffect, useMemo, useState } from "react";
// import { carService } from "@/lib/services/carService";
// import styles from "./CarCreateComponent.module.css";
// import Image from "next/image";
// import { ICar, ICarPhoto } from "@/models/ICar";
// import CarSelectsComponent from "@/components/car-selects-component/CarSelectsComponent";
// import { AxiosResponse } from "axios";
//
// type Currency = "UAH" | "USD" | "EUR";
//
// const CarCreateComponent = () => {
//   const [newCar, setNewCar] = useState<ICar>({
//     id: "",
//     brand: "",
//     model: "",
//     year: 0,
//     mileage: 0,
//     price: 0,
//     currency: "UAH",
//     price_usd: 0,
//     price_eur: 0,
//     condition: "new",
//     max_speed: 0,
//     seats_count: 0,
//     engine_volume: 0,
//     has_air_conditioner: false,
//     fuel_type: "petrol",
//     location: "",
//     description: "",
//     status: "",
//     views: 0,
//     daily_views: 0,
//     weekly_views: 0,
//     monthly_views: 0,
//     created_at: "",
//     updated_at: "",
//     exchange_rate_id: "",
//     last_exchange_update: null,
//     photos: [],
//   });
//
//   const [exchangeRates, setExchangeRates] = useState<{ USD: number; EUR: number } | null>(null);
//   const [error, setError] = useState<string | null>(null);
//
//   useEffect(() => {
//     (async () => {
//       try {
//         const response = await carService.getExchangeRates();
//         setExchangeRates(response.data);
//       } catch (err) {
//         console.error("Error fetching exchange rates:", err);
//       }
//     })();
//   }, []);
//
//   // Функція для округлення чисел до 2 знаків після коми
//   const roundToDecimal = (value: number, decimals: number) => {
//     return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
//   };
//
//   const convertedPrices = useMemo(() => {
//     if (!exchangeRates || isNaN(newCar.price) || !newCar.currency) {
//       return { UAH: 0, USD: 0, EUR: 0 };
//     }
//
//     const baseUAH =
//       newCar.currency === "UAH"
//         ? Number(newCar.price)
//         : newCar.currency === "USD"
//         ? Number(newCar.price) * (exchangeRates.USD || 0)
//         : Number(newCar.price) * (exchangeRates.EUR || 0);
//
//     const roundedBaseUAH = roundToDecimal(baseUAH, 2);
//     const roundedUSD = roundToDecimal(roundedBaseUAH / (exchangeRates.USD || 1), 2);
//     const roundedEUR = roundToDecimal(roundedBaseUAH / (exchangeRates.EUR || 1), 2);
//
//     return {
//       UAH: roundedBaseUAH || 0,
//       USD: roundedUSD || 0,
//       EUR: roundedEUR || 0,
//     };
//   }, [newCar.price, newCar.currency, exchangeRates]);
//
//  const handleInputChange = (
//   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
// ) => {
//   const { name, value, type, checked } = e.target as HTMLInputElement;
//
//   // Якщо тип - число, намагаємося перетворити значення на число, інакше використовуємо значення за замовчуванням
//   const numericValue = type === "number" ? (isNaN(parseFloat(value)) ? 0 : parseFloat(value)) : value;
//
//   // Оновлюємо стан на основі типу елемента (checkbox чи інше)
//   setNewCar((prev) => ({
//     ...prev,
//     [name]: type === "checkbox" ? checked : numericValue,
//   }));
// };
//
//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     const files = Array.from(e.target.files);
//     if (files.length + newCar.photos.length > 5) {
//       setError("You can upload up to 5 photos.");
//       return;
//     }
//     const newPhotos = files.map((file, i) => ({
//       id: `${Date.now()}-${i}`,
//       car_id: newCar.id || "",
//       photo_url: URL.createObjectURL(file),
//     }));
//     setNewCar((prev) => ({
//       ...prev,
//       photos: [...prev.photos, ...newPhotos],
//     }));
//     setError(null);
//   };
//
//   const handleDeletePhoto = (index: number) => {
//     setNewCar((prev) => ({
//       ...prev,
//       photos: prev.photos.filter((_, i) => i !== index),
//     }));
//   };
//
//   // Створення автомобіля без фотографій
//   const handleCreateCarWithoutPhotos = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const carToSend: ICar = {
//         ...newCar,
//         price: convertedPrices[newCar.currency as Currency],
//         price_usd: convertedPrices.USD,
//         price_eur: convertedPrices.EUR,
//         last_exchange_update: newCar.last_exchange_update ? new Date(newCar.last_exchange_update).toISOString().split('T')[0] : null,
//         photos: [], // без фотографій
//       };
//       console.log("Car to send:", carToSend);
//       const createdCar = (await carService.create(carToSend)) as AxiosResponse<ICar>;
//       const carId = createdCar.data.id;
//
//       // Оновлюємо стан з отриманим id
//       setNewCar((prev) => ({ ...prev, id: carId }));
//
//       if (createdCar.data.status === 'pending') {
//         alert("Your car listing contains inappropriate language. Please edit the description.");
//         return;
//       }
//
//       if (createdCar.data.status === 'inactive') {
//         alert("You have failed to edit your description 3 times. The ad has been deactivated.");
//         return;
//       }
//
//       alert("Car listing created without photos. Now you can add photos.");
//     } catch (err) {
//       console.error(err);
//       setError("Error creating car listing");
//     }
//   };
//
//   const handleAddPhotos = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newCar.id) {
//       alert("Please create a car first before adding photos.");
//       return;
//     }
//
//     try {
//       const photoArray: ICarPhoto[] = newCar.photos.map((photo) => ({
//         id: `${Date.now()}-${Math.random()}`, // Генерація унікального ID для кожної фотографії
//         car_id: newCar.id,
//         photo_url: photo.photo_url,
//       }));
//
//       await carService.addPhoto(newCar.id, photoArray);
//
//       alert("Photos added to car listing successfully!");
//     } catch (err) {
//       console.error("Error adding photos:", err);
//       setError("Error adding photos");
//     }
//   };
//
//   return (
//     <section className={styles.createCarSection}>
//       <h2>Create a New Car Listing</h2>
//       {error && <div className={styles.errorMessage}>{error}</div>}
//
//       {/* Форма для створення автомобіля без фотографій */}
//       <form className={styles.createCarForm} onSubmit={handleCreateCarWithoutPhotos}>
//         <CarSelectsComponent
//           brand={newCar.brand}
//           model={newCar.model}
//           condition={newCar.condition}
//           fuel_type={newCar.fuel_type}
//           location={newCar.location}
//           setBrand={(brand) => setNewCar((p) => ({ ...p, brand }))}
//           setModel={(model) => setNewCar((p) => ({ ...p, model }))}
//           setCondition={(condition) => setNewCar((p) => ({ ...p, condition }))}
//           setFuelType={(fuel_type) => setNewCar((p) => ({ ...p, fuel_type }))}
//           setLocation={(location) => setNewCar((p) => ({ ...p, location }))}
//         />
//         <input type="number" name="year" value={newCar.year} placeholder="Year" onChange={handleInputChange} />
//         <input type="number" name="mileage" value={newCar.mileage} placeholder="Mileage" onChange={handleInputChange} />
//         <input
//           type="number"
//           name="price"
//           value={newCar.price}
//           placeholder="Price"
//           onChange={handleInputChange}
//         />
//         <select name="currency" value={newCar.currency} onChange={handleInputChange}>
//           <option value="UAH">UAH</option>
//           <option value="USD">USD</option>
//           <option value="EUR">EUR</option>
//         </select>
//
//         <p className={styles.priceItem}>Price in UAH: {convertedPrices.UAH.toFixed(2)}</p>
//         <p className={styles.priceItem}>Price in USD: {convertedPrices.USD.toFixed(2)}</p>
//         <p className={styles.priceItem}>Price in EUR: {convertedPrices.EUR.toFixed(2)}</p>
//
//         <input
//           type="number"
//           name="max_speed"
//           value={newCar.max_speed}
//           placeholder="Max Speed"
//           onChange={handleInputChange}
//         />
//         <input
//           type="number"
//           name="seats_count"
//           value={newCar.seats_count}
//           placeholder="Seats Count"
//           onChange={handleInputChange}
//         />
//         <input
//           type="number"
//           name="engine_volume"
//           value={newCar.engine_volume}
//           placeholder="Engine Volume"
//           onChange={handleInputChange}
//         />
//         <label>
//           Air Conditioner:
//           <input
//             type="checkbox"
//             name="has_air_conditioner"
//             checked={newCar.has_air_conditioner}
//             onChange={handleInputChange}
//           />
//         </label>
//         <textarea
//           name="description"
//           value={newCar.description}
//           placeholder="Description"
//           onChange={handleInputChange}
//         />
//         <button type="submit">Create Car Listing Without Photos</button>
//       </form>
//
//       {/* Форма для додавання фотографій */}
//       <form className={styles.createCarForm} onSubmit={handleAddPhotos}>
//         <input type="file" multiple name="photos" onChange={handlePhotoChange} />
//         {newCar.photos.length > 0 && (
//           <div className={styles.photoPreview}>
//             {newCar.photos.map((photo, i) => (
//               <div key={i} className={styles.photoItem}>
//                 <Image src={photo.photo_url} alt="" width={150} height={100} />
//                 <button
//                   type="button"
//                   onClick={() => handleDeletePhoto(i)}
//                   className={styles.deletePhotoButton}
//                 >
//                   Delete
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//         {newCar.id && <button type="submit">Add Photos to Car Listing</button>}
//       </form>
//     </section>
//   );
// };
//
// export default CarCreateComponent;
