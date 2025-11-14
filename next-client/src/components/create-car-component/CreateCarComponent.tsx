
"use client";

import React, {useEffect, useState} from "react";
import { carService } from "@/lib/services/carService";
import styles from './CreateCarComponent.module.css';
import { useRouter } from 'next/router';
import Image from "next/image";
import { ICar, ICarPhoto } from "@/models/ICar";
import axios, { AxiosResponse } from "axios";

const CreateCarComponent = () => {
  const [newCar, setNewCar] = useState<ICar>({
    id: '',
    brand: '',
    model: '',
    year: 0,
    mileage: 0,
    price: 0,
    currency: 'UAH',
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
    status: '',
    views: 0,
    daily_views: 0,
    weekly_views: 0,
    monthly_views: 0,
    created_at: '',
    updated_at: '',
    exchange_rate_id: '',
    last_exchange_update: null,
    photos: [],
  });
 const [exchangeRates, setExchangeRates] = useState<{ USD: number; EUR: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('/api/exchange-rates/');
        setExchangeRates(response.data);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

 useEffect(() => {
    if (exchangeRates && newCar.price) {
      const priceInUSD = newCar.price / exchangeRates.USD;
      const priceInEUR = newCar.price / exchangeRates.EUR;

      setNewCar(prevState => ({
        ...prevState,
        price_usd: priceInUSD,
        price_eur: priceInEUR,
      }));
    }
  }, [newCar.price, exchangeRates]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      setNewCar(prevState => ({
        ...prevState,
        [name]: checked,
      }));
    } else if (e.target instanceof HTMLSelectElement) {
      // Handle <select> element
      setNewCar(prevState => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setNewCar(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + newCar.photos.length > 5) {
        setError('You can upload up to 5 photos.');
        return;
      }

      // Create array of ICarPhoto objects
      const newPhotos = files.map((file, index) => ({
        id: `${Date.now()}-${index}`, // Generate temporary ID
        car_id: '', // Will be filled after the car is created
        photo_url: URL.createObjectURL(file), // Local URL for preview
      }));

      setNewCar(prevState => ({
        ...prevState,
        photos: [...prevState.photos, ...newPhotos],
      }));
      setError(null); // Clear error after files are added
    }
  };

  const handleDeletePhoto = (index: number) => {
    setNewCar(prevState => {
      const newPhotos = [...prevState.photos];
      newPhotos.splice(index, 1);
      return {
        ...prevState,
        photos: newPhotos,
      };
    });
  };

  const handleCreateCar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdCar = await carService.create(newCar) as AxiosResponse<ICar>;  // Create car on the server
      const carId = createdCar.data.id;
      if (newCar.photos.length > 0) {
        const formData = new FormData();
        const photoArray: ICarPhoto[] = [];
        newCar.photos.forEach(photo => {
          const file = photo.photo_url;
          formData.append("photos", file);
          photoArray.push({
            id: `${Date.now()}-${photoArray.length}`,
            car_id: carId,
            photo_url: photo.photo_url,
          });
        });
        await carService.addPhoto(carId, photoArray);
      }

      alert('New car listing created!');
      await router.push('/');
    } catch (e) {
      console.error(e);
      setError('Error creating car listing');
    }
  };

  return (
    <section className={styles.createCarSection}>
      <h2>Create a New Car Listing</h2>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form className={styles.createCarForm} onSubmit={handleCreateCar}>
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={newCar.brand}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={newCar.model}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={newCar.year}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="mileage"
          placeholder="Mileage"
          value={newCar.mileage}
          onChange={handleInputChange}
        />
        <input
        type="number"
        name="price"
        value={newCar.price}
        onChange={handleInputChange}
        placeholder="Price (UAH)"
      />
      {exchangeRates && (
        <>
          <p>Price in USD: {newCar.price_usd.toFixed(2)}</p>
          <p>Price in EUR: {newCar.price_eur.toFixed(2)}</p>
        </>
      )}

        {/* Виведення ціни в інших валютах */}
        <div>
          <p>Price in USD: {newCar.price_usd.toFixed(2)}</p>
          <p>Price in EUR: {newCar.price_eur.toFixed(2)}</p>
        </div>

        <select
          name="currency"
          value={newCar.currency}
          onChange={handleInputChange}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="UAH">UAH</option>
        </select>

        <select
          name="condition"
          value={newCar.condition}
          onChange={handleInputChange}
        >
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>

        <input
          type="number"
          name="max_speed"
          placeholder="Max Speed"
          value={newCar.max_speed}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="seats_count"
          placeholder="Seats Count"
          value={newCar.seats_count}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="engine_volume"
          placeholder="Engine Volume (L)"
          value={newCar.engine_volume}
          onChange={handleInputChange}
        />
        <label>
          Air Conditioner:
          <input
            type="checkbox"
            name="has_air_conditioner"
            checked={newCar.has_air_conditioner}
            onChange={handleInputChange}
          />
        </label>

        <select
          name="fuel_type"
          value={newCar.fuel_type}
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
          value={newCar.location}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newCar.description}
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="photos"
          multiple
          onChange={handlePhotoChange}
        />
        {newCar.photos.length > 0 && (
          <div className={styles.photoPreview}>
            {newCar.photos.map((photo, index) => (
              <div key={index} className={styles.photoItem}>
                <Image
                  src={photo.photo_url}
                  alt={`Car photo ${index + 1}`}
                  className={styles.photo}
                />
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(index)}
                  className={styles.deletePhotoButton}
                >
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

export default CreateCarComponent;


