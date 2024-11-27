import React from "react";
import Link from "next/link";

import LogoWhite from "@/assets/images/logo/logoBeton.png";
const MobileLogo = () => {
  return (
    <Link href="/analytics">
      <img src={LogoWhite} alt="" />
    </Link>
  );
};

export default MobileLogo;
