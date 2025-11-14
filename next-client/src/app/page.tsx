"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "@/components/admin-user-management-component/AdminUserManagementComponent.module.css";

const HomePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(searchParams.get("message"));

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        router.replace("/", { scroll: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, router]);

  return (
    <div>
      {message && <p className={styles.registerMessage}>{message}</p>}
      <h2>Welcome to the platform</h2>
      <div className="flex flex-col justify-center items-center h-[84%] w-full">
        GSAP HOME
      </div>
    </div>
  );
};

export default HomePage;

