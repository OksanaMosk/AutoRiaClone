"use client";

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const ActivateAccount = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useParams(); // ✅ замість useRouter()
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    if (token) {
      const activationUrl = `${API_BASE_URL}/auth/activate/${token}/`;
      console.log("Activation URL (Client):", activationUrl);

      fetch(activationUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to activate account");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Activation Response:", data);
          if (data.detail === "Account activated successfully!") {
            setIsActivated(true);
          } else {
            setError("Failed to activate account");
          }
        })
        .catch((error) => {
          console.error("Error during activation:", error);
          setError("Failed to activate account");
        });
    }
  }, [token]);

  return (
    <div>
      <h1>Activate Your Account</h1>
      {isActivated ? (
        <p>Your account has been successfully activated!</p>
      ) : (
        <p>{error ? error : "Activating your account..."}</p>
      )}
    </div>
  );
};

export default ActivateAccount;
