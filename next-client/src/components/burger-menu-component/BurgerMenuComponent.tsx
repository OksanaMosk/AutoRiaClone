import type { IUser } from "@/models/IUser";
import type { FC } from "react";
import Link from "next/link";
import { UserInfoComponent } from "@/components/user-info-component/UserInfoComponent";
import ThemesButton from "@/components/themes-button/ThemesButton";
import styles from "./BurgerMenuComponent.module.css";

type BurgerMenuProps = {
    isOpen: boolean;
    from: string;
    authenticated: boolean;
    user: IUser | null;
    logoutBtn?: () => void;
    closeMenu: () => void;
    onDarkTheme: () => void;
    onLightTheme: () => void;
    theme: "dark" | "light";
};

export const BurgerMenuComponent: FC<BurgerMenuProps> = ({
                                                             isOpen,
                                                             from,
                                                             authenticated,
                                                             user,
                                                             closeMenu,
                                                         }) => {
    if (!isOpen) return null;

    return (
        <nav className={`burgerMenu ${styles.burgerMenu}`}>
            <button onClick={closeMenu} className={styles.closeBtn} aria-label="Close menu">
                ×
            </button>

            {!authenticated ? (
                <>
                    <Link
                        href={{ pathname: "/login", query: { from } }}
                        onClick={closeMenu}
                        className={styles.burgerLink}
                    >
                        Sign In
                    </Link>
                    <Link
                        href={{ pathname: "/register", query: { from } }}
                        onClick={closeMenu}
                        className={styles.burgerLink}
                    >
                        Sign Up
                    </Link>
                </>
            ) : (
                user && (
                    <UserInfoComponent
                        user={user}
                        classNames={{
                            container: styles.burgerUserContainer,
                            avatar: styles.burgerUserAvatar,
                            info: styles.burgerUserInfo,
                            welcome: styles.burgerUserWelcome,
                            user: styles.burgerUserEmail,
                            logoutBtn: styles.burgerUserLogoutBtn,
                        }}
                    />
                )
            )}

            <ThemesButton />
        </nav>
    );
};