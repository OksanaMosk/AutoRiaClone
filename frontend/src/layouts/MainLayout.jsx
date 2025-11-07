import React from 'react';
import {Outlet} from "react-router";
import styles from "./MainLayout.module.css"
import {Header} from "../components/header-component/HeaderComponent";
const MainLayout = () => {
    return (
        <div className={styles.layoutWrapper}>
            <Header/>
           <Outlet/>
        </div>
    );
};

export default MainLayout;