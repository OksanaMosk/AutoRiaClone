

import React from 'react';
import CarCreateComponent from "@/components/car-create-component/CarCreateComponent";
import {GoBackButtonComponent} from "@/components/goBack-button-component/GoBackButtonComponent";

const Page = () => {
    return (
        <div>
            <GoBackButtonComponent/>
            <CarCreateComponent/>
        </div>
    );
};

export default Page;