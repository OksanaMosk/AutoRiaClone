"use client";

import React, {useEffect, useState} from "react";
import {authService} from "@/lib/services/authService";
import {IUser} from "@/models/IUser";
import {LoaderComponent} from "@/components/loader-component/LoaderComponent";
import styles from './AdminDashboardComponent.module.css';

const AdminDashboardComponent = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // отримуємо токен з cookie
                const token = authService.getRefreshToken();
                if (!token) {
                    setError("Please activate your account.");
                    return;
                }

                const userData = await authService.getCurrentUser(token);
                setUser(userData);
            } catch (err) {
                console.error("Failed to load user data:", err);
                setError("Failed to load user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <LoaderComponent/>
    if (error) return <p>{error}</p>


    return (
        <div>
            <h1 className={styles.title}>ADMIN DASHBOARD</h1>
            {user ? (
                <>
                    <p className={styles.welcome}>
                        Welcome {user.profile?.name} {user.profile?.surname}!
                    </p>
                    <p className={styles.email}>Email: {user.email}</p>
                    <p className={styles.role}>Role: {user.role}</p>
                    {user.profile?.age && <p className={styles.age}>Age: {user.profile.age}</p>}
                    <p className={styles.info}>Browse listings, contact a seller or dealership.</p>


                    <section className={styles.section}>
                        <h2 className={styles.subtitle}>Завдання адміністратора</h2>
                        <ul className={styles.list}>
                            <li className={styles.lilk}>Керування всіма користувачами: створення, редагування, видалення акаунтів.</li>
                            <li className={styles.lilk}>Призначення ролей та дозволів менеджерам та персоналу.</li>
                            <li className={styles.lilk}>Моніторинг та контроль всіх оголошень і акаунтів автосалонів.</li>
                            <li className={styles.lilk}>Схвалення або відхилення підозрілих оголошень, помічених системою.</li>
                            <li className={styles.lilk}>Моніторинг активності платформи та статистики.</li>
                            <li className={styles.lilk}>Керування автосалонами: додавання/видалення, призначення менеджерів та персоналу.</li>
                            <li className={styles.lilk}>Доступ до звітів про перегляди, ціни та ефективність оголошень.</li>
                            <li className={styles.lilk}>Ручне втручання у оголошення, які не пройшли автоматичну перевірку.</li>
                        </ul>
                    </section>
                    <section className={styles.section}>
                        <h2 className={styles.subtitle}>Notes</h2>
                        <p className={styles.about}>
                            Admin has full control over the platform. All changes are logged and available for audit.
                            The system is flexible and allows features to be enabled/disabled without downtime.
                        </p>
                    </section>
                </>) : (
                <p className={styles.noUser}>No user data available.</p>
            )}
        </div>
    );
};

export default AdminDashboardComponent;
