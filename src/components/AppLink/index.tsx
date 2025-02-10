import React from "react";
import Link from "next/link";
import { AppLinkProps } from "./typings";

const AppLink = ({
  href,
  children,
  target = undefined,
  rel = undefined,
  onClick,
  ...props
}: AppLinkProps) => {
  return (
    <Link href={href} {...props} legacyBehavior>
      <a target={target} onClick={onClick} rel={rel}>
        {children}
      </a>
    </Link>
  );
};

export default AppLink;
