import React from 'react';
import styles from "./CarComponent.module.css"

interface CarComponentProps {
    car: {
        id:number,
        name:string,
        price:number,
        day:string

    }
}

const CarComponent = ({car}: CarComponentProps) => {
    console.log("Car data:", car)
    const {
        id,
        name,
        price,
        day,

    } = car
    return (
        <div className={styles.cardWrapper}>
            <div>
                <p>ID:{id}</p>
                <p>Day: {day}</p>
            </div>
            <div>
                {/*{photo && <img src={photo} alt={name} style={{width: '200px'}}/>}*/}
                <p>Name: {name}</p>
                <p>Price: ${price}</p>
            </div>


        </div>
    );
};

export default CarComponent;