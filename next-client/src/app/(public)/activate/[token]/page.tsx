"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ActivateAccount = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (!router.isReady || !token) return; // 👈 чекаємо, поки router буде готовий

    const activationUrl = `http://localhost:8888/api/auth/activate/${token}/`;
    console.log("Activation URL (Client):", activationUrl);

    fetch(activationUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json();
        console.log("Activation Response:", data);

        if (response.ok && data.detail === "Account activated successfully!") {
          setIsActivated(true);
        } else {
          setError(data.detail || "Failed to activate account");
        }
      })
      .catch((err) => {
        console.error("Error during activation:", err);
        setError("Failed to activate account");
      });
  }, [router.isReady, token]); // 👈 додаємо router.isReady до залежностей

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h1>Activate Your Account</h1>
      {isActivated ? (
        <p style={{ color: "green" }}>✅ Your account has been successfully activated!</p>
      ) : (
        <p>{error ? error : "Activating your account..."}</p>
      )}
    </div>
  );
};

export default ActivateAccount;
