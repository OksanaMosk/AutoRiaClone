// import React, {useEffect, useState} from 'react';
// import CarComponent from "../car-component/CarComponent";
// import {carService} from "../../services/carService";
// import {socketService} from "../../services/socketService";

const CarsComponent = () => {
    // const [cars, setCars] = useState([]);
    // const [trigger, setTrigger] = useState(null);
    // useEffect(() => {
    //     carService.getAll().then(({data}) => {
    //         setCars(data.data);
    //     })
    // }, [trigger]);
    //
    // useEffect(() => {
    //     socketInit().then()
    // }, []);
    //
    // const socketInit = async () => {
    //     const {cars} = await socketService()
    //     const client = await cars()
    //
    //     client.onopen = () => {
    //         client.send(JSON.stringify({
    //             action: "subscribe_to_cars_model_changes",
    //             request_id: new Date().getTime(),
    //         }));
    //     };
    //
    //     client.onmessage = ({data}) => {
    //         console.log(data);
    //        setTrigger(prev => !prev);
    //     }
    // }
    //
    // return (
    //      <div style={{display: 'flex', gap: '10px'}}>
    //         {
    //             cars.map(car => <CarComponent key={car.id} car={car} />)
    //         }
    //     </div>
    // );
};

export default CarsComponent;