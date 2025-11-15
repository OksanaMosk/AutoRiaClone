"use client";

import React, { useEffect, useMemo, useState } from "react";
import { carService } from "@/lib/services/carService";
import styles from "./CarCreateComponent.module.css";
import Image from "next/image";
import { ICar, ICarPhoto } from "@/models/ICar";
import CarSelectsComponent from "@/components/car-selects-component/CarSelectsComponent";
import  getUsersCars from "@/lib/services/userService";
import userService from "@/lib/services/userService";

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
  const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState("");
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
    setError(null);
  };

  const handleDeletePhoto = (index: number) => {
    setLocalPhotos((prev) => prev.filter((_, i) => i !== index));
  };

 const handleCreateCarWithoutPhotos = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
      const userId = localStorage.getItem("userId")
     const response = await userService.getUserCars(userId!)
      const cars:ICar[] = response.data
     if (cars.length >= 1) {
    setMessage("Sorry, update account to Premium");
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
      alert("Your car listing contains inappropriate language. Please edit the description.");
      return;
    }

    if (createdCar.data.status === "inactive") {
      alert("You have failed to edit your description 3 times. The ad has been deactivated.");
      return;
    }

    alert("Car created without photos. You can add photos now.");
  } catch (err: any) {
    console.error(err);
    setMessage(err.response?.data || "Error creating car listing");
  }
};


  const handleAddPhotos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCar.id) {
      alert("Please create a car first.");
      return;
    }
    try {
      const formData = new FormData();
      localPhotos.forEach((p) => formData.append("photos", p.file));
      await carService.addPhoto(newCar.id, formData);
      alert("Photos uploaded successfully!");
      setLocalPhotos([]);
    } catch (err) {
      console.error(err);
      setMessage("Error uploading photos");
    }
  };

  return (
    <section className={styles.createCarSection}>
      <h2>Create a New Car Listing</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}
        {message && <div className={styles.errorMessage}>{message}</div>}


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
        <input type="text" name="year" value={newCar.year} placeholder="Year" onChange={handleInputChange} className={styles.inputField} />
        <input type="number" name="mileage" value={newCar.mileage || ""} placeholder="Mileage" onChange={handleInputChange} className={styles.inputField} />
        <input type="number" name="price" value={newCar.price || ""} placeholder="Price" onChange={handleInputChange} className={styles.inputField} />
        <select name="currency" value={newCar.currency} onChange={handleInputChange} className={styles.inputField}>
          <option value="UAH">UAH</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        <div className={styles.currencyDisplay}>
          <div>Price in UAH: {convertedPrices.UAH.toFixed(2)}</div>
          <div>Price in USD: {convertedPrices.USD.toFixed(2)}</div>
          <div>Price in EUR: {convertedPrices.EUR.toFixed(2)}</div>
        </div>
        <input type="number" name="max_speed" value={newCar.max_speed || ""} placeholder="Max Speed" onChange={handleInputChange} className={styles.inputField} />
        <input type="number" name="seats_count" value={newCar.seats_count || ""} placeholder="Seats Count" onChange={handleInputChange} className={styles.inputField} />
        <input type="number" name="engine_volume" value={newCar.engine_volume || ""} placeholder="Engine Volume" onChange={handleInputChange} className={styles.inputField} />
        <label>
          Air Conditioner:
          <input type="checkbox" name="has_air_conditioner" checked={newCar.has_air_conditioner} onChange={handleInputChange} className={styles.checkboxField} />
        </label>
        <textarea name="description" value={newCar.description} placeholder="Description" onChange={handleInputChange} className={styles.textareaField} />
        <button type="submit" className={styles.submitButton}>Create Car Without Photos</button>
      </form>

      <form className={styles.createCarForm} onSubmit={handleAddPhotos}>
        <input type="file" multiple onChange={handlePhotoChange} className={styles.fileInput} />
        {localPhotos.length > 0 && (
          <div className={styles.photoPreview}>
            {localPhotos.map((photo, i) => (
              <div key={i} className={styles.photoItem}>
                <Image src={photo.preview_url} alt="" width={150} height={100} />
                <button type="button" onClick={() => handleDeletePhoto(i)} className={styles.deletePhotoButton}>Delete</button>
              </div>
            ))}
          </div>
        )}
        {newCar.id && <button type="submit" className={styles.submitButton}>Add Photos</button>}
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
// import { ICar } from "@/models/ICar";
// import CarSelectsComponent from "@/components/car-selects-component/CarSelectsComponent";
// import { AxiosResponse } from "axios";
//
// type Currency = "UAH" | "USD" | "EUR";
//
// interface ILocalPhoto {
//   file: File;
//   preview_url: string;
// }
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
//       photos: [] as ILocalPhoto[],
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
//   const roundToDecimal = (value: number, decimals: number) => {
//     return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
//   };
//   const convertedPrices = useMemo(() => {
//     if (!exchangeRates || isNaN(newCar.price) || !newCar.currency) {
//       return { UAH: 0, USD: 0, EUR: 0 };
//     }
//     const baseUAH =
//       newCar.currency === "UAH"
//         ? Number(newCar.price)
//         : newCar.currency === "USD"
//         ? Number(newCar.price) * (exchangeRates.USD || 0)
//         : Number(newCar.price) * (exchangeRates.EUR || 0);
//     const roundedBaseUAH = roundToDecimal(baseUAH, 2);
//     const roundedUSD = roundToDecimal(roundedBaseUAH / (exchangeRates.USD || 1), 2);
//     const roundedEUR = roundToDecimal(roundedBaseUAH / (exchangeRates.EUR || 1), 2);
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
//     let newValue = value;
//     if (type === "number" || name === "year") {
//       newValue = value.replace(/[^0-9]/g, "");
//       newValue = newValue === "" ? "" : newValue;
//     }
//     setNewCar((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : newValue,
//     }));
//   };
//
//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   if (!e.target.files) return;
//   const files = Array.from(e.target.files);
//   if (newCar.photos.length + files.length > 5) {
//     setError("You can upload up to 5 photos.");
//     return;
//   }
//   const newPhotos = files.map((file) => ({
//     file,
//     preview_url: URL.createObjectURL(file),
//   }));
//   setNewCar((prev) => ({...prev, photos: [...prev.photos, ...newPhotos],}));
//   setError(null);
// };
//
//   const handleDeletePhoto = (index: number) => {
//     setNewCar((prev) => ({
//       ...prev,
//       photos: prev.photos.filter((_, i) => i !== index),
//     }));
//   };
//
//   const handleCreateCarWithoutPhotos = async (e: React.FormEvent) => {
//     e.preventDefault();
//       const carStatus = newCar.status || "pending";
//       try {
//           const carToSend: ICar = {
//               ...newCar,
//               year: Number(newCar.year),
//               status: carStatus,
//               mileage: Number(newCar.mileage),
//               price: Number(convertedPrices[newCar.currency as Currency]),
//               price_usd: Number(convertedPrices.USD),
//               price_eur: Number(convertedPrices.EUR),
//               engine_volume: Number(newCar.engine_volume),
//               max_speed: Number(newCar.max_speed),
//               seats_count: Number(newCar.seats_count),
//               last_exchange_update: newCar.last_exchange_update ? new Date(newCar.last_exchange_update).toISOString().split('T')[0] : null,
//               photos: [] as ILocalPhoto[],
//           };
//
//    console.log("Car data being sent:", carToSend);
//       const createdCar = (await carService.create(carToSend)) as AxiosResponse<ICar>;
//       const carId = createdCar.data.id;
//
//       setNewCar((prev) => ({ ...prev, id: carId }));
//
//       if (createdCar.data.status === "pending") {
//         alert("Your car listing contains inappropriate language. Please edit the description.");
//         return;
//       }
//
//       if (createdCar.data.status === "inactive") {
//         alert("You have failed to edit your description 3 times. The ad has been deactivated.");
//         return;
//       }
//
//       alert("Car listing created without photos. Now you can add photos.");
//     } catch (err) {
//     console.error("Error creating car:", err.response?.data || err.message);
//       setError("Error creating car listing");
//     }
//   };
//
// const handleAddPhotos = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!newCar.id) {
//     alert("Please create a car first before adding photos.");
//     return;
//   }
//
//   try {
//     const files = newCar.photos.map((p) => p.file);
//     const result = await carService.addPhoto(newCar.id.toString(), files);
//     alert("Photos uploaded successfully!");
//   } catch (err) {
//     console.error(err);
//     setError("Error uploading photos");
//   }
// };
//
//
//   return (
//     <section className={styles.createCarSection}>
//       <h2>Create a New Car Listing</h2>
//       {error && <div className={styles.errorMessage}>{error}</div>}
//
//       {/* Form for creating a car without photos */}
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
//         <input
//           type="text"
//           name="year"
//           value={newCar.year}
//           placeholder="Year (e.g. 2022)"
//           onChange={handleInputChange}
//           className={styles.inputField}
//         />
//         <input
//           type="number"
//           name="mileage"
//           value={newCar.mileage || ""}
//           placeholder="Mileage (km)"
//           onChange={handleInputChange}
//           className={styles.inputField}
//         />
//         <input
//           type="number"
//           name="price"
//           value={newCar.price || ""}
//           placeholder="Price"
//           onChange={handleInputChange}
//           className={styles.inputField}
//         />
//         <select
//           name="currency"
//           value={newCar.currency}
//           onChange={handleInputChange}
//           className={styles.inputField}
//         >
//           <option value="UAH">UAH</option>
//           <option value="USD">USD</option>
//           <option value="EUR">EUR</option>
//         </select>
//
//           <div className={styles.currencyDisplay}>
//               <div>Price in UAH: {convertedPrices.UAH.toFixed(2)}</div>
//               <div>Price in USD: {convertedPrices.USD.toFixed(2)}</div>
//               <div>Price in EUR: {convertedPrices.EUR.toFixed(2)}</div>
//           </div>
//
//         <input
//           type="number"
//           name="max_speed"
//           value={newCar.max_speed || ""}
//           placeholder="Max Speed (km/h)"
//           onChange={handleInputChange}
//           className={styles.inputField}
//         />
//         <input
//           type="number"
//           name="seats_count"
//           value={newCar.seats_count || ""}
//           placeholder="Seats Count"
//           onChange={handleInputChange}
//           className={styles.inputField}
//         />
//         <input
//           type="number"
//           name="engine_volume"
//           value={newCar.engine_volume || ""}
//           placeholder="Engine Volume (L)"
//           onChange={handleInputChange}
//           className={styles.inputField}
//         />
//         <label>
//           Air Conditioner:
//           <input
//             type="checkbox"
//             name="has_air_conditioner"
//             checked={newCar.has_air_conditioner}
//             onChange={handleInputChange}
//             className={styles.checkboxField}
//           />
//         </label>
//         <textarea
//           name="description"
//           value={newCar.description}
//           placeholder="Description"
//           onChange={handleInputChange}
//           className={styles.textareaField}
//         />
//         <button type="submit" className={styles.submitButton}>
//           Create Car Listing Without Photos
//         </button>
//       </form>
//
//       {/* Form for adding photos */}
//       <form className={styles.createCarForm} onSubmit={handleAddPhotos}>
//         <input
//           type="file"
//           multiple
//           name="photos"
//           onChange={handlePhotoChange}
//           className={styles.fileInput}
//         />
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
//         {newCar.id && (
//           <button type="submit" className={styles.submitButton}>
//             Add Photos to Car Listing
//           </button>
//         )}
//       </form>
//     </section>
//   );
// };
//
// export default CarCreateComponent;
//
//
//
