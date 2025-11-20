import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Cars Seler",
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
