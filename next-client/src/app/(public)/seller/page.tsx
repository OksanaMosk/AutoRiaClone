"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // For handling URL query params
import { SellerDashboardComponent } from "@/components/sellerDashboard-component/SellerDashboard";

const SellerPage = () => {
  const [isActivated, setIsActivated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { query } = router;
    if (query?.activated === "true" && !isActivated) {
      setIsActivated(true);
    }
  }, [router.query, isActivated]);

  return (
    <div>
      <h1>Welcome to your Seller Dashboard</h1>

      {isActivated && <p>Your account has been successfully activated!</p>}

      <SellerDashboardComponent />
    </div>
  );
};

export default SellerPage;


