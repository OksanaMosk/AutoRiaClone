import React from "react";
import CarEditComponent from "@/components/car-edit-component/CarEditComponent";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>; // <-- params це Promise
}) {
  const { id } = await params;       // <-- unwrap тут
  return <CarEditComponent carId={id} />;
}
