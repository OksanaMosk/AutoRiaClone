"use client";

import React, { useState} from "react";

import {IUser} from "@/models/IUser";
import styles from './SellerDashboardComponent.module.css';


const SellerDashboardComponent = () => {
     const [users, setUsers] = useState<IUser[]>([]); // Список користувачів
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [role, setRole] = useState<string | undefined>();
    const [account_type, setAccountType] = useState<string | undefined>();
    const [is_active, setIsActive] = useState<boolean | undefined>();
    const [sortBy, setSortBy] = useState<string>('id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');


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
                                    <select
                                        className={styles.select}
                                        value={user.role}
                                        onChange={}>
                                        <option value="buyer">Buyer</option>
                                        <option value="seller">Seller</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>

                                <td>
                                    <select
                                        className={styles.select}
                                        value={user.account_type}
                                        onChange={}
                                    >
                                        <option value="basic">Basic</option>
                                        <option value="premium">Premium</option>
                                    </select>
                                </td>

                                <td className={styles.statusActive}>{user.is_active ? "Yes" : "No"}</td>
                                <td className={styles.actions}>
                                    {user.is_active ? (
                                        <button
                                            onClick={}>
                                            Block
                                        </button>
                                    ) : (
                                        <button
                                            onClick={}>
                                            Unblock
                                        </button>
                                    )}

                                    <button
                                        onClick={}>
                                        Delete
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

export default SellerDashboardComponent;


