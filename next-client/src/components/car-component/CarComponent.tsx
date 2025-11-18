"use client";

import React from "react";
import { ICar } from "@/models/ICar";
import styles from "./CarComponent.module.css";

interface Props {
  car: ICar;
}

const CarComponent: React.FC<Props> = ({ car }) => {
  return (
    <div className={styles.card}>
      {car.photos[0] && (
        <div className={styles.imageWrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={car.photos[0].photo}
            alt={`${car.brand} ${car.model}`}
            width={400}
            height={250}
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.details}>
        <h2 className={styles.title}>{car.brand} {car.model} ({car.year})</h2>
        <p><strong>Price:</strong> {car.price} {car.currency}</p>
        <p><strong>Price USD:</strong> ${car.price_usd}</p>
        <p><strong>Price EUR:</strong> €{car.price_eur}</p>
        <p><strong>Condition:</strong> {car.condition}</p>
        <p><strong>Max Speed:</strong> {car.max_speed} km/h</p>
        <p><strong>Seats:</strong> {car.seats_count}</p>
        <p><strong>Engine Volume:</strong> {car.engine_volume} L</p>
        <p><strong>Air Conditioner:</strong> {car.has_air_conditioner ? "Yes" : "No"}</p>
        <p><strong>Fuel Type:</strong> {car.fuel_type}</p>
        <p><strong>Location:</strong> {car.location}</p>
        <p><strong>Status:</strong> {car.status}</p>
        <p><strong>Views:</strong> {car.views}</p>
        <p><strong>Daily Views:</strong> {car.daily_views}</p>
        <p><strong>Weekly Views:</strong> {car.weekly_views}</p>
        <p><strong>Monthly Views:</strong> {car.monthly_views}</p>
        <p><strong>Created At:</strong> {new Date(car.created_at).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(car.updated_at).toLocaleString()}</p>
        {car.last_exchange_update && (
          <p><strong>Last Exchange Update:</strong> {new Date(car.last_exchange_update).toLocaleString()}</p>
        )}
        <p><strong>Description:</strong> {car.description}</p>
      </div>
    </div>
  );
};

export default CarComponent;
