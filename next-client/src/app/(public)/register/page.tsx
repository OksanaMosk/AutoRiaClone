import React from 'react';
import RegisterComponent from "@/components/register-component/RegisterComponent";
import {GoBackButtonComponent} from "@/components/goBack-button-component/GoBackButtonComponent";

const RegisterPage = () => {
    return (
        <div>
            <GoBackButtonComponent/>
           <RegisterComponent/>
        </div>
    );
};

export default RegisterPage;