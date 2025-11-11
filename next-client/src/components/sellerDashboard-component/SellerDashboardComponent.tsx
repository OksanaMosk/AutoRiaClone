"use client";

import React, { useEffect, useState } from "react";
import { authService } from "@/lib/services/authService";
import { IUser } from "@/models/IUser";
import { LoaderComponent } from "@/components/loader-component/LoaderComponent";
import styles from "./SellerDashboardComponent.module.css";

export const SellerDashboardComponent = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = document.cookie.split("; ").find((row) => row.startsWith("authToken="))?.split("=")[1];

    (async () => {
      if (!token) {
        setError("Please activate your account. No token found.");
        setLoading(false);
        return;
      }

      try {
        const userData: IUser = await authService.getCurrentUser(token);
        setUser(userData);
      } catch {
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoaderComponent />;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>SELLER DASHBOARD</h1>
      {user ? (
        <>
          <p className={styles.text}>
            Welcome, {user.profile?.name} {user.profile?.surname}!
          </p>
          <p className={styles.text}>Email: {user.email}</p>
          <p className={styles.text}>Role: {user.role}</p>
          <p className={styles.text}>Account Type: {user.account_type}</p>
          {user.profile?.age && <p className={styles.text}>Age: {user.profile.age}</p>}
          <p className={styles.text}>Browse listings, manage your cars or dealership.</p>
        </>
      ) : (
        <p className={styles.text}>No user data available.</p>
      )}
    </div>
  );
};

export default SellerDashboardComponent;
