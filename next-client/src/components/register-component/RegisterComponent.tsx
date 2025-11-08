"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/lib/services/authService";
import { LoaderComponent } from "@/components/loader-component/LoaderComponent";
import Image from "next/image";
import Link from "next/link";
import { PasswordInput } from "@/components/passwordInput-component/PasswordInputComponent";
import styles from "./RegisterComponent.module.css";


const RegisterComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [role, setRole] = useState<"buyer" | "seller" | "manager">("buyer");
  const [errorMsg, setErrorMsg] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Стан для індикації під час відправки

  const router = useRouter();

  // Валідація email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");
    setEmailError(""); // Скидаємо повідомлення про помилку з email

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.register({
        email,
        password,
        role,
        profile: {
          first_name: firstName,
          last_name: lastName,
          age: age ?? undefined,
        },
      });

      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Something went wrong");
      }
    } finally {
      setIsSubmitting(false); // Завершуємо відправку
    }
  };

  return (
    <div className={styles.centerContainer}>
        <form onSubmit={handleSubmit} className={`auth ${styles.form}`}>
            <h2 className={styles.title}>Sign Up</h2>

            {/* Email */}
            <div className={styles.inputGroup}>
                <input
                    type="email"
                    placeholder="Email"
                    required
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className={styles.icon}>
                        <Image
                            src="/images/user.png"
                            alt="user icon"
                            width={24}
                            height={24}
                        />
                </div>
                {emailError && <p className={styles.error}>{emailError}</p>} {/* Помилка для Email */}
            </div>

            {/* First Name */}
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    placeholder="First Name"
                    required
                    className={styles.input}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </div>

            {/* Last Name */}
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    placeholder="Last Name"
                    required
                    className={styles.input}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>

            {/* Age */}
            <div className={styles.inputGroup}>

                <input
                    type="text"
                    placeholder="Age"
                    className={styles.input}
                    value={age ?? ""}
                    onChange={(e) => {
                        const value = e.target.value;

                        // Перевіряємо, чи складається значення лише з цифр
                        if (/^\d*$/.test(value)) {
                            // Якщо рядок порожній, встановлюємо null, інакше перетворюємо на число
                            setAge(value === "" ? null : Number(value));
                        }
                    }}
                />
            </div>

            <PasswordInput
                value={password}
                onChangeAction={setPassword}
                placeholder="Password"
            />

            {/* Confirm Password */}
            <PasswordInput
                value={confirmPassword}
                onChangeAction={setConfirmPassword}
                placeholder="Confirm Password"
            />

            <div className="roleSelection">
                <button className="roleButton" data-role="buyer">
                    <Image
                        src="/images/user.png"
                        alt="Buyer"
                        width={24}
                        height={24}
                    />
                    <span>Buyer</span>
                </button>

                <button className="roleButton" data-role="seller">
                    <Image
                        src="/images/user.png"
                        alt="Seller"
                        width={24}
                        height={24}
                    />
                    <span>Seller</span>
                </button>

                <button className="roleButton" data-role="manager">
                    <Image
                        src="/images/user.png"
                        alt="Manager"
                        width={24}
                        height={24}
                    />
                    <span>Manager</span>
                </button>

                <button className="roleButton" data-role="admin">
                    <Image
                        src="/images/user.png"
                        alt="Admin"
                        width={24}
                        height={24}
                    />
                    <span>Superuser</span>
                </button>
            </div>


            {errorMsg && <p className={styles.error}>{errorMsg}</p>} {/* Помилка для пароля */}

            <button type="submit" className={styles.button} disabled={isSubmitting}>
                {isSubmitting ? <LoaderComponent/> : "Sign Up"}
            </button>

            <div className={styles.bottomContainer}>
                <p className={styles.registerText}>
                    Already have an account?{" "}
                    <Link href="/login" className={styles.link}>
                        Sign in
                    </Link>
                </p>
            </div>
        </form>
    </div>
  );
};

export default RegisterComponent;
