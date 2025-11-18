"use client";
import React from "react";
import { ICar } from "@/models/ICar";
import styles from "./CarComponent.module.css";
import {ScrollTopButtonComponent} from "@/components/scroll-top-button-component/ScrollTopButtonComponent";
import Image from "next/image";

interface Props {
  car: ICar;
}
const CarComponent: React.FC<Props> = ({ car }) => {

  return (
    <div
      className={styles.cardWrapper}>
      <div className={styles.carItem}>
        {car.photos[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
          <img
            src={car.photos[0].photo}
            alt={`${car.brand} ${car.model}`}
            width={150}
            height={100}
            className={styles.carPoster}
          />
        ) : (
          <div className={styles.noPoster}>
                        <Image
                            src='/images/noPoster.png'
                            alt="No poster"
                            className={styles.placeholder}
                            width={150}
                            height={100}
                            sizes="(max-width: 150px) 30vw, 100px"
                        />
                    </div>
        )}
          <div className={styles.r}>
            <span className={styles.label}>Price:  </span>{" "}
            <span className={styles.value}>
              {car.price} <strong>{car.currency}</strong>
            </span>
          </div>
      </div>

      <div className={styles.carInfoWrapper}>
        <div className={styles.carInfo}>
          <h2 className={styles.carTitle}>
            {car.brand} {car.model}{" "} {car.year}
          </h2>

          <div className={styles.row}>
            <span className={styles.label}>Condition:  </span>{" "}
            <span className={styles.value}>{car.condition}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Max Speed:  </span>{" "}
            <span className={styles.value}>{car.max_speed} km/h</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Seats:  </span>{" "}
            <span className={styles.value}>{car.seats_count}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Engine:  </span>{" "}
            <span className={styles.value}>{car.engine_volume} L</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Fuel:  </span>{" "}
            <span className={styles.value}>{car.fuel_type}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Location:  </span>{" "}
            <span className={styles.value}>{car.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarComponent;

