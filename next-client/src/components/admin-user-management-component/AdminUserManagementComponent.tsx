"use client"
import React, { useEffect, useState } from "react";
import { authService } from "@/lib/services/authService";
import { IUser } from "@/models/IUser";
import styles from './AdminUserManagementComponent.module.css';
import userService from "@/lib/services/userService";
import {useRouter} from "next/navigation";


const AdminUserManagementComponent = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [role, setRole] = useState<string | undefined>();
    const [account_type, setAccountType] = useState<string | undefined>();
    const [is_active, setIsActive] = useState<boolean | undefined>();
    const [sortBy, setSortBy] = useState<string>('id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
const router = useRouter();

    useEffect(() => {
  (async () => {
    try {
      setLoading(true);

      const token = authService.getRefreshToken();
      if (!token) {
        setError("Please activate your account.");
        return;
      }

      const filters = { role, account_type, is_active, sort_by: sortBy, sort_order: sortOrder };
      const allUsers = await userService.filterSortUsers(filters);
      setUsers(allUsers);

    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  })();
}, [role, account_type, is_active, sortBy, sortOrder]);

    const handleBlockUser = async (userId: string) => {
        try {
            await userService.block(userId);
            setUsers(prev =>
                prev.map(u => u.id && String(u.id) === userId ? { ...u, is_active: false } : u)
            );
        } catch (err) {
            console.error("Error blocking user", err);
        }
    };

    const handleUnblockUser = async (userId: string) => {
        try {
            await userService.unblock(userId);
            setUsers(prev =>
                prev.map(u => u.id && String(u.id) === userId ? { ...u, is_active: true } : u)
            );
        } catch (err) {
            console.error("Error unblocking user", err);
        }
    };

    const handleChangeRole = async (userId: string, role: "buyer" | "seller" | "manager" | "admin") => {
        try {
            await userService.changeRole(userId, role);
            setUsers(prev => prev.map(u =>
                u.id !== undefined && String(u.id) === userId ? { ...u, role } : u
            ));
        } catch (err) {
            console.error("Error changing account type", err);
        }
    };

    const handleChangeAccountType = async (userId: string, account_type: string) => {
        try {
            await userService.changeAccountType(userId, account_type);
            setUsers(prev => prev.map(u =>
                u.id !== undefined && String(u.id) === userId ? {...u, account_type} : u
            ));
        } catch (err: unknown) {
            const resStatus = (err as { response?: { status?: number; data?: unknown } })?.response?.status;
            if (resStatus === 500) {
                alert("Internal server error occurred. Please try again later.");
            } else {
                alert("An error occurred while changing the account type.");
            }
        }
    };

    const handleDeleteUser = async (userId: number | undefined) => {
        if (userId === undefined) {
            alert("User ID is undefined");
            return;
        }

        try {
            await userService.delete(String(userId));
            setUsers(users.filter(user => String(user.id) !== String(userId)));
            alert('User deleted successfully');
        } catch (err) {
            console.error('Error deleting user', err);
            alert('Error deleting user');
        }
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className={styles.userManagement}>
            <h2 className={styles.subtitle}>Manage Users</h2>

            <div className={styles.filters}>
                <select onChange={e => setRole(e.target.value)} value={role} className={styles.select}>
                    <option value="">All Roles</option>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                </select>
                <select onChange={e => setAccountType(e.target.value)} value={account_type} className={styles.select}>
                    <option value="">All Account Types</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                </select>
                <select
                    onChange={e => {
                        const value = e.target.value;
                        if (value === "") setIsActive(undefined)
                        else setIsActive(value === "true");
                    }}
                    value={
                        is_active === null || is_active === undefined
                            ? ""
                            : is_active
                                ? "true"
                                : "false"
                    }
                    className={styles.select}
                >
                    <option value="">All Users</option>
                    <option value="true">Active</option>
                    <option value="false">Blocked</option>
                </select>
                <select onChange={e => setSortBy(e.target.value)} value={sortBy} className={styles.select}>
                    <option value="id">ID</option>
                    <option value="email">Email</option>
                    <option value="role">Role</option>
                </select>
                <select onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')} value={sortOrder} className={styles.select}>
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Email</th>
                        <th>Full Name</th>
                        <th>Role</th>
                        <th>Account Type</th>
                        <th>Active</th>
                        <th>Actions</th>
                         <th>Cars</th>
                    </tr>
                </thead>
                <tbody>
                  {Array.isArray(users) && users.length > 0 ? (
                        users.map(user => (
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
                                        <button onClick={() => handleBlockUser(String(user.id))} className={styles.blockButton}>Block</button>
                                    ) : (
                                        <button onClick={() => handleUnblockUser(String(user.id))}
                                                className={styles.unblockButton}>Unblock</button>
                                    )}
                                    <button onClick={() => handleDeleteUser(user.id)}
                                            className={styles.deleteButton}>Delete
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => router.push(`/seller/${user.id}`)}
                                        className={styles.viewCarsButton}
                                    >
                                        View Cars
                                    </button>
              </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={7}>No users found</td></tr>
                    )}
                </tbody>
            </table>
        </section>
    );
};

export default AdminUserManagementComponent;
