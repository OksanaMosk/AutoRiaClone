"use client";

import AdminDashboardComponent from "@/components/admin-dashboard-component/AdminDashboardComponent";
import {GoBackButtonComponent} from "@/components/go-back-button-component/GoBackButtonComponent";


const Page = () => {
  return (
    <div style={{
      fontWeight: 'bolder',
      margin: '40px auto',
      textAlign: 'center',
      width: '100%'
    }}>
      <GoBackButtonComponent/>
      <AdminDashboardComponent />
    </div>
  );
};

export default Page;