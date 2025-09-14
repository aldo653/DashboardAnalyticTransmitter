import Navbar from "./navbar";
import Header from "./header";

const MainLayout = ({ children }) => {
  return (
    <div id="main-wrapper" style={{ border: "1px solid #ccc", padding: "1rem" }}>
      {/* Sidebar */}
      <Navbar />

      {/* Content */}
      <div className="page-wrapper">
        <Header />
         <div class="body-wrapper">
          <div class="container-fluid">
            {children}
          </div>
        </div>
        {/* End Content */}
      </div>
    </div>
  );
};

export default MainLayout;
