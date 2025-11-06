import React from 'react';
import {Outlet} from "react-router";
import styles from "./MainLayout.module.css"
const MainLayout = () => {
    return (
        <div className={styles.layoutWrapper}>
           <Outlet/>
        </div>
    );
};

export default MainLayout;