import React from 'react';
import { useSearchParams } from "next/navigation"; // або useRouter, якщо потрібно
import { CarsClientComponent } from "@/components/cars-client-component/CarsClientComponent";

const CarsPage = () => {
  const searchParams = useSearchParams();
  const currentPageFromURL = Number(searchParams.get("pg") || "1");
  const filters = {

  };

  return (
    <div>
      <h1>Cars</h1>
      <CarsClientComponent
        currentPageFromURL={currentPageFromURL}
        filters={filters}
      />
    </div>
  );
};

export default CarsPage;


