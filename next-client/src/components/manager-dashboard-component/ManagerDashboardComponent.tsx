"use client";

import React, { useEffect, useState } from "react";
import { authService } from "@/lib/services/authService";
import { IUser } from "@/models/IUser";
import { LoaderComponent } from "@/components/loader-component/LoaderComponent";
import styles from "./ManagerDashboardComponent.module.css";
import ManagerUserManagementComponent
    from "@/components/manager-user-management-component/ManagerUserManagementComponent";

export const ManagerDashboardComponent = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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
    } catch (e) {
        console.log(e);
        setError("There was an error fetching user data.");
      const refreshToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("refreshToken="))
        ?.split("=")[1];

      if (refreshToken) {
        try {
          const access = await authService.refreshToken(refreshToken);
          document.cookie = `authToken=${access}; path=/; max-age=${7 * 24 * 60 * 60}; sameSite=strict`;
          const userData: IUser = await authService.getCurrentUser(access);
          setUser(userData);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          setError("Your session has expired. Please log in again.");
        }
      } else {
        setError("Please log in again.");
      }
    } finally {
      setLoading(false);
    }
  })();
}, []);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
            <LoaderComponent />
        </div>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>MANAGER DASHBOARD</h1>
      {user ? (
        <div className={styles.userInfo}>
          <p className={styles.text}>
            Welcome, {user.profile?.name} {user.profile?.surname}!
          </p>
          <p className={styles.text}>Email: {user.email}</p>
          <p className={styles.text}>Role: {user.role}</p>
          {user.profile?.age && <p className={styles.text}>Age: {user.profile.age}</p>}
            <ManagerUserManagementComponent/>
        </div>
      ) : (
        <p className={styles.text}>No user data available.</p>
      )}
    </div>
  );
};

export default ManagerDashboardComponent;
