"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const ConditionalFooter = () => {
  const pathname = usePathname();

  const hideFooterRoutes = [
    "/%E2%88%85", // The void page
  ];

  if (hideFooterRoutes.includes(pathname)) {
    return null;
  }

  return <Footer />;
};

export default ConditionalFooter;
