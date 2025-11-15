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

  if (loading) return <LoaderComponent />;
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

      {/* Секція для завдань менеджера */}
      <div className={styles.taskList}>
        <h2 className={styles.taskListHeader}>Your Tasks</h2>
        <div className={styles.taskItem}>
          <p className={styles.taskItemHeader}>Review Suspicious Listings</p>
          <p className={styles.taskItemDescription}>
            Check the listings that have been flagged by the system for suspicious activity and take necessary actions.
          </p>
        </div>

        <div className={styles.taskItem}>
          <p className={styles.taskItemHeader}>Block Problematic Users</p>
          <p className={styles.taskItemDescription}>
            Review users flagged for violations and block them if necessary to maintain the integrity of the platform.
          </p>
        </div>

        <div className={styles.taskItem}>
          <p className={styles.taskItemHeader}>Moderate Reports</p>
          <p className={styles.taskItemDescription}>
            Review and resolve any reports made by users regarding inappropriate listings, spamming, or other issues.
          </p>
        </div>
      </div>

      {/* Інші можливості менеджера */}
      <div className={styles.adminOptions}>
        <h2 className={styles.adminOptionsHeader}>Admin Options</h2>
        <button className={styles.adminButton}>View User Activity</button>
        <button className={styles.adminButton}>Manage Banned Users</button>
        <button className={styles.adminButton}>Generate Reports</button>
      </div>
    </div>
  );
};

export default ManagerDashboardComponent;
