
import React from "react";
import { ICar } from "@/models/ICar";
import styles from "./CarInfoComponent.module.css";

interface CarInfoComponentProps {
  car: ICar;
}
const CarInfoComponent: React.FC<CarInfoComponentProps> = ({ car }) => {
  return (
    <div className={styles.container}>
      <div className={styles.flexRowResponsive}>
       {car.photos[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
          <img
            src={car.photos[0].photo}
            alt={`${car.brand} ${car.model}`}
            width={400}
            height={300}
            className={styles.carPoster}
          />
        ) : (
          <div className={styles.noPoster}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src='/images/noPoster.png'
                            alt="No poster"
                            className={styles.placeholder}
                            width={500}
                            height={400}
                            sizes="(max-width: 600px) 100vw, 500px"
                        />
                    </div>
        )}
        <div className={styles.content}>
          <h1 className={styles.title}>
            {car.brand} {car.model}
          </h1>
          <div className={styles.details}>
            <p><strong>ID:</strong> {car.id}</p>
            <p><strong>Year:</strong> {car.year}</p>
            <p><strong>Mileage:</strong> {car.mileage.toLocaleString()} km</p>
            <p><strong>Currency:</strong> {car.currency}</p>
            <p><strong>Price UAH:</strong> {car.price.toLocaleString()}</p>
            <p><strong>Price USD:</strong> {car.price_usd?.toLocaleString()}</p>
            <p><strong>Price EUR:</strong> {car.price_eur?.toLocaleString()}</p>
            <p><strong>Condition:</strong> {car.condition}</p>
            <p><strong>Max Speed:</strong> {car.max_speed} km/h</p>
            <p><strong>Seats:</strong> {car.seats_count}</p>
            <p><strong>Engine Volume:</strong> {car.engine_volume} L</p>
            <p><strong>AC:</strong> {car.has_air_conditioner ? "Yes" : "No"}</p>
            <p><strong>Fuel Type:</strong> {car.fuel_type}</p>
            <p><strong>Location:</strong> {car.location}</p>
          </div>
          {car.description && (
            <p className={styles.overview}><strong>Description:</strong> {car.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarInfoComponent;



