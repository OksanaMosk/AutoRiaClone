"use client";

import React, {useEffect, useState} from "react";
import {authService} from "@/lib/services/authService";
import {IUser} from "@/models/IUser";
import styles from './ManagerUserManagementComponent.module.css';
import userService from "@/lib/services/userService";

const ManagerUserManagementComponent = () => {
    const [users, setUsers] = useState<IUser[]>([]); // Список користувачів
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [message, setMessage] = useState<string | null>(null);
const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const token = authService.getRefreshToken();
                if (!token) {
                    setError("Please activate your account.");
                    return;
                }

                const allUsers = await userService.getAll();
                const usersData = allUsers.data;
                console.log("usersData", usersData);
                setUsers(usersData);

            } catch (err) {
                console.error("Failed to load users:", err);
                setError("Failed to load user data");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Блокування користувача
    const handleBlockUser = async (userId: string) => {
  try {
    await userService.block(userId);
    setUsers(prev =>
      prev.map(u => u.id && String(u.id) === userId ? { ...u, is_active: false } : u)
    );
    showMessage("User has been blocked", "success");
  } catch (err) {
    console.error("Error blocking user", err);
    showMessage("Failed to block user", "error");
  }
};

const handleUnblockUser = async (userId: string) => {
  try {
    await userService.unblock(userId);
    setUsers(prev =>
      prev.map(u => u.id && String(u.id) === userId ? { ...u, is_active: true } : u)
    );
    showMessage("User has been unblocked", "success");
  } catch (err) {
    console.error("Error unblocking user", err);
    showMessage("Failed to unblock user", "error");
  }
};


    // Зміна ролі користувача
    const handleChangeRole = async (userId: string, role: "buyer" | "seller" | "manager" | "admin") => {
        try {
            await userService.changeRole(userId, role);
            setUsers(prev => prev.map(u =>
                u.id !== undefined && String(u.id) === userId ? {...u, role} : u
            ));
        } catch (err) {
            console.error("Error changing account type", err);
        }
    };

    const handleChangeAccountType = async (userId: string, account_type: string) => {
  try {
    const { data } = await userService.changeAccountType(userId, account_type);
    // Якщо зміна пройшла успішно
    setUsers(prev => prev.map(u =>
      u.id !== undefined && String(u.id) === userId ? { ...u, account_type } : u
    ));
  } catch (err: any) {
    if (err.response && err.response.status === 500) {
      // Виведення повідомлення, якщо сервер повернув помилку 500
      console.error("Internal Server Error:", err.response.data);
      alert("Internal server error occurred. Please try again later.");
    } else {
      console.error("Error changing account type", err);
      alert("An error occurred while changing the account type.");
    }
  }
};

    // Видалення користувача
    const handleDeleteUser = async (userId: number | undefined) => {
        if (userId === undefined) {
            alert("User ID is undefined");
            return;
        }

        try {
            await userService.delete(String(userId));
            setUsers(users.filter(user => String(user.id) !== String(userId))); // Перетворення тут
            alert('User deleted successfully');
        } catch (err) {
            console.error('Error deleting user', err);
            alert('Error deleting user');
        }
    };
    const showMessage = (text: string, type: "success" | "error") => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
            setMessage(null);
            setMessageType(null);
        }, 3000);
    };
    if (loading) return <div>Loading...</div>;
    if (error) return <p>{error}</p>;

    return (
        <section className={styles.userManagement}>
            <h2 className={styles.subtitle}>Manage Users</h2>

            <table className={styles.table}>
                <thead>
                <tr>
                    <th>User ID</th>
                    <th>Email</th>
                    <th>Full Name</th>
                    <th>Role</th>
                    <th>Account Type</th>
                    <th>Blocked</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td className={styles.user}>{user.id}</td>
                        <td className={styles.user}>{user.email}</td>
                        <td className={styles.user}>{user.profile?.name} {user.profile?.surname}</td>

                        <td>
                            <select className={styles.select}
                                value={user.role}
                                onChange={e => handleChangeRole(String(user.id), e.target.value as "buyer" | "seller" | "manager" | "admin")}
                            >
                                <option value="buyer">Buyer</option>
                                <option value="seller">Seller</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>

                        </td>
                        <td>
                            <select className={styles.select} defaultValue={user.account_type}
                                    onChange={e => handleChangeAccountType(String(user.id), e.target.value)}>
                                <option value="basic">Basic</option>
                                <option value="premium">Premium</option>
                            </select>
                        </td>
                        <td className={styles.statusActive}>{user.is_active ? "Yes" : "No"}</td>
                        <td className={styles.actions}>
                            {user.is_active ? (
                                <button onClick={() => handleBlockUser(String(user.id))}
                                        className={styles.blockButton}>Block</button>
                            ) : (
                                <button onClick={() => handleUnblockUser(String(user.id))}
                                        className={styles.unblockButton}>Unblock</button>
                            )}
                            <button onClick={() => handleDeleteUser(user.id)} className={styles.deleteButton}>Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );
};
export default ManagerUserManagementComponent;


//   const handleFilterChange = async () => {
//   try {
//     const filteredUsers = await userService.filterUsers({
//       role: roleFilter || undefined,
//       account_type: accountTypeFilter || undefined,
//       // is_active: blockedFilter || undefined,
//     });
//     setUsers(filteredUsers);
//   } catch (err) {
//     console.error("Error filtering users", err);
//     alert("Error filtering users");
//   }
// };

   // // Призначення ролі "admin"
    // const handlePromoteToAdmin = async (userId: string) => {
    //     try {
    //         await userService.promoteToAdmin(userId);
    //         setUsers(prev =>
    //             prev.map(u => (u.id !== undefined && String(u.id) === userId ? {...u, role: "admin"} : u))
    //         );
    //         alert("User promoted to Admin");
    //     } catch (err) {
    //         console.error("Error promoting user", err);
    //     }
    // };
