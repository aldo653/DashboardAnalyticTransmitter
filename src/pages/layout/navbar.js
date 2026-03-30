import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname(); 

  return (
    <div>
      <aside className="left-sidebar with-horizontal">
        <div>
          <nav className="sidebar-nav scroll-sidebar container-fluid">
            <ul id="sidebarnav">
              <li className="sidebar-item">
                <Link className={`sidebar-link ${pathname === "/main" ? "active" : ""}`} href="/main" aria-expanded="false">
                  <span><i className="ti ti-clock"></i></span>
                  <span className="hide-menu">System Performance Overview</span>
                </Link>
              </li>

              <li className="sidebar-item">
                <Link className={`sidebar-link ${pathname === "/regional" ? "active" : ""}`} href="/regional" aria-expanded="false">
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
