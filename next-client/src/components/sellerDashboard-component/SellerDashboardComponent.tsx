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

          <section className={styles.accountDetails}>
            <h2>Account Details</h2>
            <p>Your account is currently {user.account_type === "premium" ? "Premium" : "Basic"}</p>
            {user.account_type === "premium" && (
              <div className={styles.premiumFeatures}>
                <ul>
                  <li>Unlimited number of listings</li>
                  <li>Access to advanced statistics on your listings</li>
                  <li>Market average prices and views per listing</li>
                </ul>
              </div>
            )}
            {user.account_type === "basic" && (
              <div className={styles.basicFeatures}>
                <ul>
                  <li>You can post one vehicle for sale</li>
                  <li>Upgrade to Premium for more listings and features</li>
                </ul>
              </div>
            )}
          </section>

          <section className={styles.listingsInfo}>
            <h2>Your Listings</h2>
            <p>You can manage your vehicle listings here. As a {user.account_type} user, your posting limits are:</p>
            <ul>
              {user.account_type === "basic" ? (
                <li>One active listing at a time</li>
              ) : (
                <li>Unlimited active listings</li>
              )}
            </ul>
            {/* Optionally, include logic to display current listings */}
          </section>

          <section className={styles.createListing}>
            <h2>Create a New Listing</h2>
            <p>If you want to sell a car, click here to create a new listing.</p>
            {/* Button or form to create a new listing */}
          </section>
        </>
      ) : (
        <p className={styles.text}>No user data available.</p>
      )}
    </div>
  );
};

export default SellerDashboardComponent;

