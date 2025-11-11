"use client";

import React, { useEffect, useState } from "react";
import { authService } from "@/lib/services/authService";
import { IUser } from "@/models/IUser";
import { LoaderComponent } from "@/components/loader-component/LoaderComponent";

const BuyerDashboardComponent = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1]; // Перевіряємо наявність токену

    const fetchUserData = async () => {
      if (!token) {
        setError("Please activate your account.");
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
    };

    fetchUserData();
  }, []);

  if (loading) return <LoaderComponent />
  if (error) return <p>{error}</p>

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.profile?.name} {user.profile?.surname}!</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <p>Account Type: {user.account_type}</p>
          {user.profile?.age && <p>Age: {user.profile.age}</p>}
          <p>Browse listings, contact a seller or dealership.</p>
        </>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default BuyerDashboardComponent;
