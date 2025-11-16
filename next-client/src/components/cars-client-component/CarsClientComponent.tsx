import React, {useState, useEffect, useCallback} from "react";
import {useSearchParams} from "next/navigation";
import CarsComponent from "@/components/cars-component/CarsComponent";
import {PaginationComponent} from "@/components/pagination-component/PaginationComponent";
import {ICar} from "@/models/ICar";
import {LoaderComponent} from "@/components/loader-component/LoaderComponent";

interface CarsClientComponentProps {
  cars: ICar[];
}


const CarsClientComponent:React.FC<CarsClientComponentProps> = ({ cars }) => {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("pg") || "1");
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<Record<string, string | number>>({});
    const [error, setError] = useState<string | null>(null);

    const fetchCars = useCallback(async (page: number, filters: Record<string, string | number>) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.set("pg", page.toString());
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.set(key, value.toString());
            });
            const res = await fetch(`?${params.toString()}`);
            if (!res.ok) {
                return new Error(`Failed to fetch cars: ${res.statusText}`);
            }
            const json = await res.json();
            setTotalPages(json.total_pages || 1);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to load cars, please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        (async () => {
            try {
                await fetchCars(page, filters);
            } catch (err) {
                console.error("Error during fetch:", err);
            }
        })();
    }, [fetchCars, page, filters]);
    const handleFilterChange = (newFilters: Record<string, string | number>) => {
        setFilters(newFilters);
    };

    if (loading) return <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
            <LoaderComponent />
        </div>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <CarsComponent cars={cars} onFilterChange={handleFilterChange}/>
            <PaginationComponent totalPages={totalPages}/>
        </div>
    );
}

export  default CarsClientComponent