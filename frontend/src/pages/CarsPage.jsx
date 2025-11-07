import React from 'react';
import CarForm from "../components/form-car-component/CarForm";
import CarsComponent from "../components/cars-component/CarsComponent";
import Chat from "../components/chat-component/Chat";

const CarsPage = () => {
    return (
        <div>
           <CarForm/>
            <hr/>
            <CarsComponent/>
            <hr/>
            <Chat/>
        </div>
    );
};

export default CarsPage;