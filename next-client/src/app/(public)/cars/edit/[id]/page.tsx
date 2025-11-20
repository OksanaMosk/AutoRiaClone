import React from "react";
import CarEditComponent from "@/components/car-edit-component/CarEditComponent";
import {GoBackButtonComponent} from "@/components/go-back-button-component/GoBackButtonComponent";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>; // <-- params це Promise
}) {
  const { id } = await params;       // <-- unwrap тут
  return (
      <div>
          <GoBackButtonComponent/>
          <CarEditComponent carId={id}/></div>
    )
}
