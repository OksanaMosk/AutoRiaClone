import React from 'react';
import {CarsClientComponent} from "@/components/cars-client-component/CarsClientComponent";
import {GoBackButtonComponent} from "@/components/goBack-button-component/GoBackButtonComponent";

const CarsPage = () => {
  return (
    <div>
        <GoBackButtonComponent/>
      <CarsClientComponent/>
    </div>
  );
};

export default CarsPage;


