import React from 'react';
import {useForm} from "react-hook-form";
import {carService} from "../../services/carService";

const CarForm = () => {
    const{register, handleSubmit,reset} = useForm();
    const save = async (car)=>{
       await carService.create(car)
    }

    return (
        <form onSubmit={handleSubmit(save)}>
            <input type="text" name="name" placeholder={"Name"} {...register("name")}/>
            <input type="number" name="price" placeholder={"Price"} {...register("price")}/>
            <input type="number" name="size" placeholder={"Size (cm)"} {...register("size")}/>
            <input type="text" name="ingredients" placeholder={"Ingredients (comma separated)"} {...register("ingredients")}/>
            <input type="number" name="time_prepared" placeholder={"Time prepared (min)"} {...register("time_prepared")}/>
            <input type="text" name="day" placeholder={"Day (e.g. Sunday)"} {...register("day")}/>
            <button type="submit">Add Car</button>
        </form>
    );
};

export default CarForm;