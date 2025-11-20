import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Cars Seller",
};

type Props = {
    children: React.ReactNode;
}

const SellerLayout = ({children}: Props) => {
    return (
        <>
            {children}
        </>
    );
}
export default SellerLayout;
