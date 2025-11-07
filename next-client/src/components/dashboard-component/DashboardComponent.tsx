"use client";

import { useSession } from "next-auth/react";
import {LoaderComponent} from "@/components/loader-component/LoaderComponent";
import {AdminDashboard} from "@/components/adminDashboard-component/AdminDashboard";
import {SellerDashboard} from "@/components/sellerDashboard-component/SellerDashboard";
import {BuyerView} from "@/components/buyerView-component/BuyerView";

export default function DashboardComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoaderComponent />;
  }

  if (!session) {

    return <p>Please log in.</p>;
  }

  const role = session.user.role;

  if (role === "admin") {
    return <AdminDashboard />;
  }
  if (role === "seller") {
    return <SellerDashboard />;
  }
  return <BuyerView />;
}
