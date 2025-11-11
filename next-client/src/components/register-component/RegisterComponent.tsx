"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authService } from "@/lib/services/authService";
import { PasswordInput } from "@/components/passwordInput-component/PasswordInputComponent";
import { LoaderComponent } from "@/components/loader-component/LoaderComponent";
import styles from "./RegisterComponent.module.css";

const RegisterComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [role, setRole] = useState<"buyer" | "seller" | "manager">("buyer");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [errorFields, setErrorFields] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateAge = (age: number | null): boolean => {
    return age != null && age > 0 && age < 150;
  };

 const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
     event.preventDefault();
     setErrorMsg("");
     setErrorFields({});
     const errors: { [key: string]: string } = {};

     if (!validateEmail(email)) errors.email = "Please enter a valid email address.";
     if (password !== confirmPassword) errors.password = "Passwords do not match.";
     else if (!validatePassword(password)) errors.password = "Password must be at least 6 characters long.";
     if (!validateAge(age)) errors.age = "Please enter a valid age.";

     if (Object.keys(errors).length > 0) {
         setErrorFields(errors);
         return;
     }

     setIsSubmitting(true);

     try {
         await authService.register({
             email,
             password,
             role,
             profile: {name, surname, age: age ?? undefined},
         });

         router.push("/?message=Please check your email to activate your account");

     } catch (err: unknown) {
         if (err instanceof Error) {
             // Перевіряємо повідомлення помилки від сервера
             if (err.message.includes("already exists")) {
                 setErrorMsg("A user with this email already exists.");
             } else {
                 setErrorMsg("!A user with this email already exists.");
             }
         } else {
             setErrorMsg("An unknown error occurred.");
         }
     } finally {
         setIsSubmitting(false); // Завжди виконується, незалежно від того, була помилка чи ні
     }
 };

  return (
    <div className={styles.centerContainer}>
      <form onSubmit={handleSubmit} className={`auth ${styles.form}`}>
        <h2 className={styles.title}>Sign Up</h2>

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
            <Image src="/images/user.png" alt="user icon" width={24} height={24} />
          </div>
          {errorFields.email && <p className={styles.error}>{errorFields.email}</p>}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Name"
            required
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Surname"
            required
            className={styles.input}
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="number"
            placeholder="Age"
            className={styles.input}
            value={age ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) setAge(value === "" ? null : Number(value));
            }}
          />
          {errorFields.age && <p className={styles.error}>{errorFields.age}</p>}
        </div>

        <PasswordInput
          value={password}
          onChangeAction={setPassword}
          placeholder="Password (min 6 characters)"
        />
        <PasswordInput
          value={confirmPassword}
          onChangeAction={setConfirmPassword}
          placeholder="Confirm Password"
        />
        {errorFields.password && <p className={styles.error}>{errorFields.password}</p>}

        <div className={styles.roleSelection}>
          <button type="button" className={styles.roleButton} onClick={() => setRole("buyer")}>
            <Image src="/images/user.png" alt="Buyer" width={30} height={30} />
            <span>Buyer</span>
          </button>

          <button type="button" className={styles.roleButton} onClick={() => setRole("seller")}>
            <Image src="/images/user.png" alt="Seller" width={30} height={30} />
            <span>Seller</span>
          </button>
        </div>

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? <LoaderComponent /> : "Sign Up"}
        </button>

        <div className={styles.bottomContainer}>
          <p className={styles.registerText}>
            Already have an account?{" "}
            <a href="/login" className={styles.link}>
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterComponent;