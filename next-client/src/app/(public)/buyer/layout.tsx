import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Cars Buyer",
};

type Props = {
    children: React.ReactNode;
}

const BuyerLayout = ({children}: Props) => {
    return (
        <>
            {children}
        </>
    );
}
export default BuyerLayout;
