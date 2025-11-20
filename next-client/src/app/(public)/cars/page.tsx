import React from 'react';
import {CarsClientComponent} from "@/components/cars-client-component/CarsClientComponent";
import {GoBackButtonComponent} from "@/components/go-back-button-component/GoBackButtonComponent";

const CarsPage = () => {
  return (
    <div>
        <GoBackButtonComponent/>
      <CarsClientComponent/>
    </div>
  );
};

export default CarsPage;


