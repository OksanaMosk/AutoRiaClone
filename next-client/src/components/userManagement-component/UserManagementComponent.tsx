"use client";

import React, { useEffect, useState } from "react";
import { authService } from "@/lib/services/authService";
import { IUser } from "@/models/IUser";
import styles from './UserManagementComponent.module.css';
import userService from "@/lib/services/userService";

const UserManagementComponent = () => {
  const [users, setUsers] = useState<IUser[]>([]); // Список користувачів
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>("");
  const [isBlockedFilter, setIsBlockedFilter] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = authService.getRefreshToken();
        if (!token) {
          setError("Please activate your account.");
          return;
        }

        const allUsers = await userService.getAll();
        const usersData=allUsers.data
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

  const handleFilterChange = async () => {
    try {
      const filteredUsers = await userService.filterUsers({
        role: roleFilter,
        account_type: accountTypeFilter,
        // isBlocked: isBlockedFilter,
      });
      setUsers(filteredUsers);  // Оновлюємо список користувачів
    } catch (err) {
      console.error("Error filtering users", err);
      alert("Error filtering users");
    }
  };

  const handleChangeRole = async (userId: string | number | undefined, role: string) => {
    if (userId === undefined) {
      alert("User ID is undefined");
      return;
    }

    try {
      const userIdStr = String(userId);
      await userService.update(userIdStr, { role });
      alert('Role updated successfully');
    } catch (err) {
      console.error('Error changing role', err);
      alert('Error changing role');
    }
  };

  const handleChangeAccountType = async (userId: string | number | undefined, accountType: string) => {
    if (userId === undefined) {
      alert("User ID is undefined");
      return;
    }

    try {
      const userIdStr = String(userId);
      await userService.update(userIdStr, { account_type: accountType });
      alert('Account type updated successfully');
    } catch (err) {
      console.error('Error changing account type', err);
      alert('Error changing account type');
    }
  };

  const handleDeleteUser = async (userId: string | number | undefined) => {
    if (userId === undefined) {
      alert("User ID is undefined");
      return;
    }

    try {
      const userIdStr = String(userId);
      await userService.delete(userIdStr);
      setUsers(users.filter(user => String(user.id) !== userIdStr));
      alert('User deleted successfully');
    } catch (err) {
      console.error('Error deleting user', err);
      alert('Error deleting user');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <p>{error}</p>;

  return (
    <section className={styles.userManagement}>
      <h2 className={styles.subtitle}>Manage Users</h2>

      {/* Форма для фільтрації */}
      <div className={styles.filterForm}>
        <label>Role:</label>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        <label>Account Type:</label>
        <select
          value={accountTypeFilter}
          onChange={(e) => setAccountTypeFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
        </select>

        <label>Blocked:</label>
        {/*<select*/}
        {/*  value={isBlockedFilter === null ? "" : isBlockedFilter}*/}
        {/*  onChange={(e) => setIsBlockedFilter(e.target.value === "" ? null : e.target.value === "true")}*/}
        {/*>*/}
        {/*  <option value="">All</option>*/}
        {/*  <option value="true">Blocked</option>*/}
        {/*  <option value="false">Unblocked</option>*/}
        {/*</select>*/}

        <button onClick={handleFilterChange}>Apply Filters</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Account Type</th>
            <th>Actions</th>
          </tr>
        </thead>
       <tbody>
  {Array.isArray(users) && users.map(user => (
    <tr key={user.id}>
      <td>{user.profile?.name} {user.profile?.surname}</td>
      <td>
        <select
          defaultValue={user.role}
          onChange={(e) => handleChangeRole(user.id, e.target.value)}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </td>
      <td>
        <select
          defaultValue={user.account_type}
          onChange={(e) => handleChangeAccountType(user.id, e.target.value)}
        >
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
        </select>
      </td>
      <td>
        <button
          className={styles.deleteButton}
          onClick={() => handleDeleteUser(user.id)}
        >
          Delete User
        </button>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </section>
  );
};

export default UserManagementComponent;

