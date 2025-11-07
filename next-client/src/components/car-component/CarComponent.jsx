import React from 'react';
import styles from "./CarComponent.module.css"

const CarComponent = ({car}) => {
    console.log("Car data:", car)
    const {
        id,
        name,
        price,
        size,
        ingredients,
        time_prepared,
        day,
        photo
    } = car
    return (
        <div className={styles.cardWrapper}>
            <div>
                <p>ID:{id}</p>
                <p>Day: {day}</p>
            </div>
            <div>
                {photo && <img src={photo} alt={name} style={{ width: '200px' }} />}
                <p>Name: {name}</p>
                <p>Price: ${price}</p>
            </div>
            {/*<p>Size: {size}'</p>*/}
            {/*<p>Time Prepare: {time_prepared} min</p>*/}
            {/*<p>Ingredients: {ingredients.join(', ')}</p>*/}

        </div>
    );
};

export  default CarComponent;