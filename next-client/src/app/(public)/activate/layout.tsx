import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Cars Activate",
};

type Props = {
    children: React.ReactNode;
}

const ActivateLayout = ({children}: Props) => {
    return (
        <>
            {children}
        </>
    );
}
export default ActivateLayout;
