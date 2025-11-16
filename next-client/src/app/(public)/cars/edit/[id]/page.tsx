import React from "react";
import CarEditComponent from "@/components/car-edit-component/CarEditComponent";

interface EditCarPageProps {
  params: Promise<{ id: string }>;
}

const EditCarPage = async ({ params }: EditCarPageProps) => {
  const { id } = await params; // <-- треба await
  return <CarEditComponent carId={id} />;
};

export default EditCarPage;


