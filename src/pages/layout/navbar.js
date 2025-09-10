import React from "react";

export default function Navbar() {
  return (
    <div>
      <aside className="left-sidebar with-horizontal">
        <div>
          <nav className="sidebar-nav scroll-sidebar container-fluid">
            <ul id="sidebarnav">
              <li className="nav-small-cap">
                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                <span className="hide-menu">Home</span>
              </li>

              <li className="sidebar-item">
                <a className="sidebar-link" href="#" aria-expanded="false">
                  <span><i className="ti ti-broadcast"></i></span>
                  <span className="hide-menu">Daily Transmission</span>
                </a>
              </li>
               <li className="sidebar-item">
                <a className="sidebar-link" href="#" aria-expanded="false">
                  <span><i className="ti ti-flame"></i></span>
                  <span className="hide-menu">Warmup Backup Transmitter</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}
