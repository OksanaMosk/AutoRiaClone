"use client";

import Link from "next/link";
import { useState } from "react";
import { BurgerMenuComponent } from "@/components/burger-menu-component/BurgerMenuComponent";
import { UserInfoComponent } from "@/components/user-info-component/UserInfoComponent";
import ThemesButton from "@/components/themes-button/ThemesButton";
import type { IUser } from "@/models/IUser";
import {usePathname} from "next/navigation";
import Image from "next/image";
import styles from "./MenuClientComponent.module.css";
import {router} from "next/client";

type Props = {
    user: IUser | null;
    authenticated: boolean;
};

export const MenuClientComponent = ({ user, authenticated }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const pathname = usePathname();
    const isCarsActive = pathname.startsWith("/cars");
    const isLoginActive = pathname === "/login";
    const isRegisterActive = pathname === "/register";
    const from = "/";

    const handleDark = () => setTheme("dark");
    const handleLight = () => setTheme("light");

    const handleLogout = () => {
    };

    return (
        <div className={styles.header}>
            <nav className={styles.navbar}>
                <Link href="/" className={styles.logoLink}>
                    <Image src="/favicon/android-chrome-512x512.png" alt="logo" width={51} height={51} />
                    <div className={styles.logo}>
                        <h1 className={styles.logoTitle}>Gold Frame Flow</h1>
                    </div>
                </Link>

                <ul className={styles.menuList}>
                    <li>
                        <Link href="/cars" className={isCarsActive ? styles.activeLink : styles.menuItem}>
                            Cars
                        </Link>
                    </li>
                </ul>

                <div className={styles.rightBlock}>
                    {authenticated && user ? (
                        <UserInfoComponent
                            user={{ email: user.email, token: user.token }}
                        />
                    ) : (
                        <div className={styles.authLinks}>
                            <Link href={{ pathname: "/login", query: { from } }}  className={isLoginActive ? styles.activeLink : styles.menuItem}>Sign In</Link>
                            <Link href={{ pathname: "/register", query: { from } }}  className={isRegisterActive ? styles.activeLink : styles.menuItem}>Sign Up</Link>
                        </div>
                    )}
                    <ThemesButton />
                </div>

                <button onClick={() => setIsOpen(true)} className={styles.burger}>
                <div className={styles.burgerLine} />
                <div className={styles.burgerLine} />
                <div className={styles.burgerLine} />
            </button>
            </nav>

            <BurgerMenuComponent
                isOpen={isOpen}
                from={from}
                authenticated={authenticated}
                user={user}
                logoutBtn={handleLogout}
                closeMenu={() => setIsOpen(false)}
                onDarkTheme={handleDark}
                onLightTheme={handleLight}
                theme={theme}
            />
        </div>
    );
};