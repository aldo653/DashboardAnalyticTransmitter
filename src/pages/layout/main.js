import React, { useState, useEffect } from 'react';
import navbar from './navbar';
import header from './header';

const MainLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <>
      {/* Preloader */}
      {loading && (
        <div className="preloader">
          <img
            src="/assets/asset/logo.png"
            alt="loader"
            className="lds-ripple img-fluid"
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
