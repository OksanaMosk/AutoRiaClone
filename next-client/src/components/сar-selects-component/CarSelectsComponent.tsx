import React, { useState, useEffect } from "react";
import { BRANDS, MODELS_BY_BRAND, LOCATION_CHOICES } from "@/lib/constants";

interface CarSelectsProps {
  brand: string;
  model: string;
  condition: string;
  fuel_type: string;
  location: string;
  setBrand: (brand: string) => void;
  setModel: (model: string) => void;
  setCondition: (condition: string) => void;
  setFuelType: (fuelType: string) => void;
  setLocation: (location: string) => void;
}

const CarSelectsComponent: React.FC<CarSelectsProps> = ({
  brand,
  model,
  condition,
  fuel_type,
  location,
  setBrand,
  setModel,
  setCondition,
  setFuelType,
  setLocation
}) => {
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    const models = MODELS_BY_BRAND[brand] || [];
    setAvailableModels(models);
  }, [brand]);

  return (
    <div>
      {/* Селект для вибору бренду */}
      <select name="brand" value={brand} onChange={(e) => setBrand(e.target.value)}>
        <option value="">Select Brand</option>
        {BRANDS.map((brandOption) => (
          <option key={brandOption} value={brandOption}>
            {brandOption}
          </option>
        ))}
      </select>

      {/* Селект для вибору моделі */}
      {brand && (
        <select name="model" value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="">Select Model</option>
          {availableModels.map((modelOption) => (
            <option key={modelOption} value={modelOption}>
              {modelOption}
            </option>
          ))}
        </select>
      )}

      {/* Селект для вибору стану автомобіля */}
      <select name="condition" value={condition} onChange={(e) => setCondition(e.target.value)}>
        <option value="new">New</option>
        <option value="used">Used</option>
      </select>

      {/* Селект для вибору типу пального */}
      <select name="fuel_type" value={fuel_type} onChange={(e) => setFuelType(e.target.value)}>
        <option value="petrol">Petrol</option>
        <option value="diesel">Diesel</option>
        <option value="electric">Electric</option>
        <option value="hybrid">Hybrid</option>
      </select>

      {/* Селект для вибору локації */}
      <select name="location" value={location} onChange={(e) => setLocation(e.target.value)}>
        <option value="">Select Location</option>
        {LOCATION_CHOICES.map(([loc]) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>
    </div>
  );
};


export default CarSelectsComponent;

