import React from "react";
import CarManagementComponent from "@/components/car-management-component/CarManagementComponent";
import {GoBackButtonComponent} from "@/components/go-back-button-component/GoBackButtonComponent";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>; // <- params може бути Promise
}) {
  const { id } = await params;      // <- unwrap тут
  return (
    <div>
      <h2>Cars of User #{id}</h2>
      <CarManagementComponent userId={id} />
        <GoBackButtonComponent/>
    </div>
  );
}


