import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname(); // Mendapatkan path saat ini

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
                <Link className={`sidebar-link ${pathname === "/" ? "active" : ""}`} href="/" aria-expanded="false">
                  <span><i className="ti ti-broadcast"></i></span>
                  <span className="hide-menu">Main Transmission</span>
                </Link>
              </li>

              <li className="sidebar-item">
                <Link className={`sidebar-link ${pathname === "/warmup" ? "active" : ""}`} href="/warmup" aria-expanded="false">
                  <span><i className="ti ti-building-broadcast-tower"></i></span>
                  <span className="hide-menu">Regional Transmission</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}
