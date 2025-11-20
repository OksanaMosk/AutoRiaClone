"use client";

import React, { useEffect, useState } from "react";
import { authService } from "@/lib/services/authService";
import { IUser } from "@/models/IUser";
import { LoaderComponent } from "@/components/loader-component/LoaderComponent";
import styles from "./BuyerDashboardComponent.module.css";

const BuyerDashboardComponent = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const getCookie = (name: string): string | null => {
    return (
      document.cookie
        .split("; ")
        .find((row) => row.startsWith(name + "="))
        ?.split("=")[1] ?? null
    );
  };

  // -------------------------
  //   LOAD USER LOGIC
  // -------------------------

  useEffect(() => {
    const loadUser = async () => {
      const token = getCookie("authToken");

      if (!token) {
        setError("Please activate your account.");
        setLoading(false);
        return;
      }

      try {
        // Спробувати отримати користувача
        const userData = await authService.getCurrentUser(token);
        setUser(userData);

      } catch (e) {
        console.warn("Token expired, trying refresh...");

        const refreshToken = getCookie("refreshToken");

        if (!refreshToken) {
          setError("Your session has expired. Please log in again.");
          setLoading(false);
          return;
        }

        try {
          // Оновлення токенів (куки оновлюються всередині сервісу!)
          const tokens = await authService.refreshToken(refreshToken);

          // Пробуємо отримати користувача з новим доступом
          const userData = await authService.getCurrentUser(tokens.access);
          setUser(userData);

        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          setError("Your session has expired. Please log in again.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);
  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <LoaderComponent />
      </div>
    );

  if (error) return <p className={styles.errorText}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>BUYER PORTAL</h1>

      {user ? (
        <>
          <p className={styles.text}>
            Welcome, {user.profile?.name} {user.profile?.surname}!
          </p>
          <p className={styles.text}>Email: {user.email}</p>
          <p className={styles.text}>Role: {user.role}</p>
          {user.profile?.age && <p className={styles.text}>Age: {user.profile.age}</p>}
        </>
      ) : (
        <p className={styles.text}>No user data available.</p>
      )}
    </div>
  );
};

export default BuyerDashboardComponent;
