import React from 'react';
import styles from "./PizzaComponent.module.css"

const PizzaComponent = ({pizza}) => {
    console.log("Pizza data:", pizza)
    const {
        id,
        name,
        price,
        size,
        ingredients,
        time_prepared,
        day,
        photo
    } = pizza
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
            <p>Size: {size}'</p>
            <p>Time Prepare: {time_prepared} min</p>
            {/*<p>Ingredients: {ingredients.join(', ')}</p>*/}

        </div>
    );
};

export  default PizzaComponent;