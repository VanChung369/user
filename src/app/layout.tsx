import type { Metadata } from "next";
import AppProvider from "@/components/AppProvider";
import "../styles/globals.scss";
import "antd/dist/reset.css";

import { FC } from "react";

export const metadata: Metadata = {
  title: "NFT treasure",
  description:
    "The pioneering minting platform for trusted NFTs with incredible benefits",
};

const RootLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
};
export default RootLayout;
