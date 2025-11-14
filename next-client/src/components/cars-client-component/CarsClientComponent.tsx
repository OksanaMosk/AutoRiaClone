"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CarsComponent from "@/components/cars-component/CarsComponent";
import { PaginationComponent } from "@/components/pagination-component/PaginationComponent";
import { ICar } from "@/models/ICar";

export default function CarsClientComponent() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("pg") || "1");

  const [cars, setCars] = useState<ICar[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("pg", page.toString());
      const res = await fetch(`?${params.toString()}`);
      const json = await res.json();
      setCars(json.data);
      setTotalPages(json.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [page]);

  if (loading) return <p>Loading cars...</p>;

  return (
    <div>
      <CarsComponent cars={cars} />
      <PaginationComponent totalPages={totalPages} />
    </div>
  );
}
