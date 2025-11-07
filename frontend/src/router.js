import {createBrowserRouter, Navigate} from "react-router";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import CarsPage from "./pages/CarsPage";



const router = createBrowserRouter([
    {
        path: '', element: <MainLayout/>,
        children: [
            {
                index: true, element: <Navigate to="login"/>
            },
            {
                path: 'login', element: <LoginPage/>
            },
            {
                path: 'cars', element: <CarsPage/>
            }
        ]
    }
]);

export {
    router
}
