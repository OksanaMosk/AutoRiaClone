"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AccountsComponent from "@/components/accounts-component/AccountsComponent";
import HeroComponent from "@/components/hero-component/HeroComponent";
import {GoBackButtonComponent} from "@/components/go-back-button-component/GoBackButtonComponent";
import {ScrollTopButtonComponent} from "@/components/scroll-top-button-component/ScrollTopButtonComponent";

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
   <div
  style={{
    fontWeight: "bolder",
    margin: "40px auto",
      textAlign: "center",
       width: '100vw'
  }}
>
      {message && <p style={{ color: "#003333", fontWeight: "bolder" }}>{message}</p>
}
      <h2>Welcome to the platform</h2>
      <div className="">
         <HeroComponent/>
          <AccountsComponent/>
          <ScrollTopButtonComponent/>
      </div>
    </div>
  );
};

export default HomePage;

