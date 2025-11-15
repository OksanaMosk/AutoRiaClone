"use client";

import React, { useEffect, useState } from "react";
import { carService } from "@/lib/services/carService";
import { ICar } from "@/models/ICar";

import CarListingComponent from "@/components/car-listing-component/CarListingComponent";
import {LoaderComponent} from "@/components/loader-component/LoaderComponent";
import {IUser} from "@/models/IUser";
import {authService} from "@/lib/services/authService";
import styles from "./SellerDashboardComponent.module.css";
import userService from "@/lib/services/userService";
type StatusFilter = "all" | "active" | "inactive";

const SellerDashboardComponent: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [cars, setCars] = useState<ICar[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (!user) return; // Замість цього використовуйте умовну перевірку в середині функції
        (async () => {
            try {
                setLoading(true);
                if (!user?.id) {
                    setError("User ID is not available.");
                    return;
                }
                const res = await userService.getUserCars(user.id.toString());
                console.log(res);

                setCars(res.data);
            } catch (err) {
                console.error("Failed to load cars:", err);
                setError("Failed to load car data");
            } finally {
                setLoading(false);
            }
        })();
    }, [user]);

    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("authToken="))
            ?.split("=")[1];

        (async () => {
            if (!token) {
                setError("Please activate your account.");
                setLoading(false);
                return;
            }

            try {
                const userData: IUser = await authService.getCurrentUser(token);
                setUser(userData);
            } catch {
                setError("Please activate your account.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <LoaderComponent/>;
    if (error) return <p className={styles.errorText}>{error}</p>;


    const handleDelete = (carId: string) => {
        setCars(prev => prev.filter(c => c.id !== carId));
    };

    const handleStatusChange = (carId: string, status: string) => {
        setCars(prev =>
            prev.map(car => (car.id === carId ? {...car, status} : car))
        );
    };



  const filteredCars = (Array.isArray(cars) ? cars : []).filter(car => {
    if (filter === "all") return true;
    return filter === "active" ? car.status === "active" : car.status !== "active";
});


    return (
        <div className={styles.dashboard}>
            <h2>My Car Listings</h2>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <div className={styles.filters}>
                <button onClick={() => setFilter("all")} className={filter === "all" ? styles.activeFilter : ""}>All
                </button>
                <button onClick={() => setFilter("active")}
                        className={filter === "active" ? styles.activeFilter : ""}>Active
                </button>
                <button onClick={() => setFilter("inactive")}
                        className={filter === "inactive" ? styles.activeFilter : ""}>Inactive
                </button>
            </div>
            {loading ? (
                <p><LoaderComponent/></p>
            ) : (
                <div className={styles.cardsContainer}>
                    {filteredCars.map(car => (
                        <CarListingComponent
                            key={car.id}
                            car={car}
                            onDelete={handleDelete}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SellerDashboardComponent;

