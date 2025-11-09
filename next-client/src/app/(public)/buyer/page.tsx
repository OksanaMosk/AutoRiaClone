"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // For handling URL query params

import {BuyerDashboardComponent} from "@/components/buyerDashboard-component/BuyerDashboardComponent";

const BuyerPage = () => {
  // const [isActivated, setIsActivated] = useState(false);
  // const router = useRouter();
  //
  // useEffect(() => {
  //   const { query } = router;
  //
  //   if (query?.activated === "true" && !isActivated) {
  //     setTimeout(() => {
  //       setIsActivated(true);
  //     }, 0);
  //   }
  // }, [router, router.query, isActivated]);

  return (
    <div>
      <h1>Welcome to your Buyer Dashboard</h1>
      {/*{isActivated && <p>Your account has been successfully activated!</p>}*/}
      <BuyerDashboardComponent />
    </div>
  );
};

export default BuyerPage;

