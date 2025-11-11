"use client";

import React, { useEffect, useState } from "react";
import { authService } from "@/lib/services/authService";
import { IUser } from "@/models/IUser";
import { LoaderComponent } from "@/components/loader-component/LoaderComponent";
import styles from './AdminDashboardComponent.module.css';
import UserManagementComponent from "@/components/userManagement-component/UserManagementComponent";

const AdminDashboardComponent = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  if (loading) return <LoaderComponent />;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
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
          <UserManagementComponent />
        </>
      ) : (
        <p className={styles.noUser}>No user data available.</p>
      )}
    </div>
  );
};

export default AdminDashboardComponent;