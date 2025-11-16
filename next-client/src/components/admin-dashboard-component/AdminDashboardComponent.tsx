"use client";

import React, { useEffect, useState } from "react";
import { authService } from "@/lib/services/authService";
import { IUser } from "@/models/IUser";
import { LoaderComponent } from "@/components/loader-component/LoaderComponent";
import styles from './AdminDashboardComponent.module.css';
import AdminUserManagementComponent from "@/components/admin-user-management-component/AdminUserManagementComponent";
import Loading from "@/app/(public)/cars/loading";

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

  if (loading) return <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
            <LoaderComponent />
        </div>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.containerDashboard}>
      <h1 className={styles.title}>ADMIN DASHBOARD</h1>
      {user ? (
        <>
          <p className={styles.welcome}>
            Welcome {user.profile?.name} {user.profile?.surname}!
          </p>
          <p className={styles.email}>Email: {user.email}</p>
          <p className={styles.role}>Role: {user.role}</p>
          <AdminUserManagementComponent />
        </>
      ) : (
        <p className={styles.noUser}>No user data available.</p>
      )}
    </div>
  );
};

export default AdminDashboardComponent;