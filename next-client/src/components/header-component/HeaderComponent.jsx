// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from './HeaderComponent.module.css';
// import {NavLink} from "react-router";
// import {MenuComponent} from "../menu-component/MenuComponent";
//
//
// export const Header = () =>{
//     const navigate = useNavigate(); // Для редіректу за допомогою useNavigate
//
//     const handleLogout = () => {
//
//         navigate('/login');
//     };
//
//
//     return (
//         <header className={styles.header}>
//             <MenuComponent/>
//             <nav className={styles.nav}>
//                 <ul className={styles.list}>
//                     <li >
//                         <NavLink to="/" className={styles.link}>Home</NavLink>
//                     </li>
//                     <li>
//                         <NavLink to="/login" className={styles.link}>Login</NavLink>
//                     </li>
//                     <li>
//                         <NavLink to="/register" className={styles.link}>Register</NavLink>
//                     </li>
//                     <li>
//                         <button onClick={handleLogout} className={styles.button}>Logout</button>
//                     </li>
//                 </ul>
//             </nav>
//         </header>
//     );
// }
//
//
//
//
