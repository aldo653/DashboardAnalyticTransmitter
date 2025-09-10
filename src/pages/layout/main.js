import React, { useState, useEffect } from "react";
import Image from "next/image";
import navbar from "./navbar";
import header from "./header";

const MainLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Preloader */}
      {loading && (
        <div className="preloader">
          <Image
            src="/assets/images/logos/I-PMS-04.webp"
            alt="loader"
            className="lds-ripple img-fluid"
            width={200}
            height={200}
            priority
          />
        </div>
      )}

      {/* Main Wrapper */}
      <div id="main-wrapper">
        {/* Sidebar Vertical */}
        {navbar()}

        {/* Page Wrapper */}
        <div className="page-wrapper">
          {/* Topbar */}
          {header()}

          {/* Page Content */}
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
