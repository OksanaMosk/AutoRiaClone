"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./RegisterComponent.module.css";
import { authService } from "@/services/authService";
import { LoaderComponent } from "@/components/loader-component/LoaderComponent";
import Image from "next/image";
import Link from "next/link";

const RegisterComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        email,
        password,
        profile: {
          first_name: firstName,
          last_name: lastName,
          age: age,
        },
      });

      router.push("/login"); // переходимо на логін після успішної реєстрації
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
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
            type="number"
            placeholder="Age"
            required
            className={styles.input}
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className={styles.inputGroup}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className={styles.icon}
            onClick={() => setShowPassword(!showPassword)}
          >
            <Image
              src={showPassword ? "/images/eye.png" : "/images/no-eye.png"}
              alt="Toggle password visibility"
              width={24}
              height={24}
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className={styles.inputGroup}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            required
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div
            className={styles.icon}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Image
              src={showConfirmPassword ? "/images/eye.png" : "/images/no-eye.png"}
              alt="Toggle confirm password visibility"
              width={24}
              height={24}
            />
          </div>
        </div>


        {errorMsg && <p className={styles.error}>{errorMsg}</p>}


        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? <LoaderComponent /> : "Sign Up"}
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
