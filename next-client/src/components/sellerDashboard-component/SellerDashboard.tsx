"use client";

import React from "react";

export const SellerDashboard=()=> {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>
      <p>Your account type: Seller.</p>
      <ul className="list-disc ml-6">
        <li>Create a new listing</li>
        <li>View your active listings</li>
        <li>View statistics (if you have a Premium account)</li>
      </ul>
      {/* Add a form for creating a listing, tables, filters, etc. */}
    </div>
  );
}
