"use client"; // обов'язково для компонентів з useState/useEffect у Next 13+

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginComponent.module.css";
import { authService } from "@/lib/services/authService";
import { LoaderComponent } from "@/components/loader-component/LoaderComponent";
import Image from "next/image";
import Link from "next/link";

const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await authService.login({ username, password }); // твій authService
      router.push("/dashboard"); // переходимо після успішного логіну
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.centerContainer}>
      <form onSubmit={handleSubmit} className={`auth ${styles.form}`}>
        <h2 className={styles.title}>Sign In</h2>

        {/* Username */}
        <div className={styles.inputGroup}>
          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Username"
            required
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className={styles.icon}>
            <Image
              src="/images/user.png"
              alt="User icon"
              width={24}
              height={24}
            />
          </div>
        </div>

        {/* Password */}
        <div className={styles.inputGroup}>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
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

        {/* Forgot password */}
        <div className={styles.registerText}>
          <Link href="/forgot-password" className={styles.link}>
            Forgot password?
          </Link>
        </div>

        {/* Error message */}
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        {/* Submit button */}
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? (
            <div className= {styles.loaderWrapper}>
              <LoaderComponent />
            </div>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Register link */}
        <div className={styles.bottomContainer}>
          <p className={styles.registerText}>
            Dont have an account?{" "}
            <Link href="/register" className={styles.link}>
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginComponent;