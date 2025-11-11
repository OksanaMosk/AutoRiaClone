'use client';


import { IUser } from "@/models/IUser";
import styles from "./UserInfoComponent.module.css";

type UserInfoProps = {
    user: IUser | null;
    classNames?: {
        container?: string;
        avatar?: string;
        info?: string;
        welcome?: string;
        user?: string;
        logoutBtn?: string;
    };
};

export const UserInfoComponent = ({ user, classNames = {} }: UserInfoProps) => {
    if (!user) return null;

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", { method: "POST" });
            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const avatarLetter = user.email ? user.email[0].toUpperCase() : "?";

    return (
        <div className={`${styles.container} ${classNames.container ?? ""}`}>
            <div className={`${styles.avatar} ${classNames.avatar ?? ""}`}>
                {avatarLetter}
            </div>

            <div className={`${styles.info} ${classNames.info ?? ""}`}>
                <p className={`${styles.welcome} ${classNames.welcome ?? ""}`}>Welcome,</p>
                <p className={`${styles.user} ${classNames.user ?? ""}`}>{user.email}</p>

                <button
                    onClick={handleLogout}
                    className={`${styles.logoutBtn} ${classNames.logoutBtn ?? ""}`}
                >
                    Sign out
                </button>
            </div>
        </div>
    );
};