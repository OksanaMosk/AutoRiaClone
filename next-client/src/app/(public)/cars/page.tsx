import React from 'react';
import CarFormComponent from "@/components/form-car-component/CarFormComponent";
import CarsComponent from "@/components/cars-component/CarsComponent";
import ChatComponent from "@/components/chat-component/ChatComponent";

const CarsPage = () => {
    return (
        <div>
           <CarFormComponent/>
            <hr/>
            <CarsComponent/>
            <hr/>
            <ChatComponent/>
        </div>
    );
};

export default CarsPage;