import React from "react";
import Image from "next/image";

export default function Header() {
    return (
        <div>
            <header className="topbar">
                <div className="with-vertical">
                    <nav className="navbar navbar-expand-lg p-0">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link sidebartoggler nav-icon-hover ms-n3" id="headerCollapse" href="#">
                                    <i className="ti ti-menu-2"></i>
                                </a>
                            </li>
                        </ul>

                        <div className="d-block d-lg-none flex items-center">
                            <Image
                                src="/assets/asset/main_logo.svg"
                                alt="Main Logo"
                                width={180}
                                height={60}
                            />
                        </div>

                        <a className="navbar-toggler nav-icon-hover p-0 border-0" href="#" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="p-2"><i className="ti ti-dots fs-7"></i></span>
                        </a>

                        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                            <div className="d-flex align-items-center justify-content-between">
                                <a href="#" className="nav-link d-flex d-lg-none align-items-center justify-content-center" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobilenavbar" aria-controls="offcanvasWithBothOptions">
                                    <i className="ti ti-align-justified fs-7"></i>
                                </a>

                                <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-center">
                                    {/* Notification Dropdown */}
                                    <li className="nav-item dropdown">
                                        <a className="nav-link nav-icon-hover" href="#" id="drop2" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="ti ti-bell-ringing"></i>
                                            <div className="notification bg-primary rounded-circle"></div>
                                        </a>
                                        <div className="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                                            <div className="d-flex align-items-center justify-content-between py-3 px-7">
                                                <h5 className="mb-0 fs-5 fw-semibold">Notifications</h5>
                                                <span className="badge text-bg-primary rounded-4 px-3 py-1 lh-sm">5 new</span>
                                            </div>
                                            <div className="message-body" data-simplebar></div>
                                            <div className="py-6 px-7 mb-1">
                                                <button className="btn btn-outline-primary w-100">See All Notifications</button>
                                            </div>
                                        </div>
                                    </li>

                                    {/* Profile Dropdown */}
                                    <li className="nav-item dropdown">
                                        <a className="nav-link pe-0" href="#" id="drop1" data-bs-toggle="dropdown" aria-expanded="false">
                                            <div className="d-flex align-items-center">
                                                <div className="user-profile-Image">
                                                    <Image src="/assets/images/profile/user-1.jpg" alt="User Profile" className="rounded-circle" width={35} height={35} />
                                                </div>
                                            </div>
                                        </a>
                                        <div className="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop1">
                                            <div className="profile-dropdown position-relative" data-simplebar>
                                                <div className="py-3 px-7 pb-0">
                                                    <h5 className="mb-0 fs-5 fw-semibold">Information</h5>
                                                </div>
                                                <div className="d-flex align-items-center py-9 mx-7 border-bottom">
                                                    <Image src="/assets/images/profile/user-1.jpg" alt="User Avatar" className="rounded-circle" width={80} height={80} />
                                                    <div className="ms-3">
                                                        <h5 className="mb-1 fs-3">Operator</h5>
                                                        <span className="mb-1 d-block">TVRI Transmitter Operator</span>
                                                    </div>
                                                </div>
                                                <div className="d-grid py-4 px-7 pt-8">
                                                    <a href="./main/authentication-login.html" className="btn btn-outline-primary">Log Out</a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>

                    {/* Offcanvas Mobile Menu */}
                    <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="mobilenavbar" aria-labelledby="offcanvasWithBothOptionsLabel">
                        <nav className="sidebar-nav scroll-sidebar">
                            <div className="offcanvas-header justify-content-between">
                                <Image src="/assets/images/logos/favicon.ico" alt="Favicon" className="img-fluid" width={32} height={32} />
                                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>
                            <div className="offcanvas-body" data-simplebar style={{ height: "100%" }}></div>
                        </nav>
                    </div>
                </div>

                {/* App Header */}
                <div className="app-header with-horizontal">
                    <nav className="navbar navbar-expand-xl container-fluid p-0">
                        <ul className="navbar-nav align-items-center">
                            <li className="nav-item d-block d-xl-none"><a className="nav-link sidebartoggler ms-n3" id="sidebarCollapse" href="#"><i className="ti ti-menu-2"></i></a></li>
                            <li className="nav-item d-none d-xl-flex align-items-center"><a href="./main/index.html" className="text-nowrap nav-link d-flex align-items-center"><Image src="/assets/asset/main_logo.svg" alt="Main Logo" className="dark-logo" width={180} height={60} /><h6 className="ms-2 fw-bold"><strong>Transmission Analytic Dashboard</strong></h6></a></li>
                        </ul>
                        <div className="d-block d-xl-none">
                            <a href="./main/index.html" className="text-nowrap nav-link">
                                <Image src="/assets/asset/main_logo.svg" alt="Main Logo" width={180} height={60} />
                            </a>
                        </div>
                        <a className="navbar-toggler nav-icon-hover p-0 border-0" href="#" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="p-2"><i className="ti ti-dots fs-7"></i></span>
                        </a>
                        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                            <div className="d-flex align-items-center justify-content-between px-0 px-xl-8">
                                <a href="#" className="nav-link round-60 p-1 ps-0 d-flex d-xl-none align-items-center justify-content-center" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobilenavbar" aria-controls="offcanvasWithBothOptions">
                                    <i className="ti ti-align-justified fs-7"></i>
                                </a>
                                <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-center">
                                    <li className="nav-item dropdown">
                                        <a className="nav-link nav-icon-hover" href="#" id="drop2" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="ti ti-bell-ringing"></i>
                                            <div className="notification bg-primary rounded-circle"></div>
                                        </a>
                                        <div className="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                                            <div className="d-flex align-items-center justify-content-between py-3 px-7">
                                                <h5 className="mb-0 fs-5 fw-semibold">Notifications</h5>
                                                <span className="badge text-bg-primary rounded-4 px-3 py-1 lh-sm">5 new</span>
                                            </div>
                                            <div className="message-body" data-simplebar></div>
                                            <div className="py-6 px-7 mb-1">
                                                <button className="btn btn-outline-primary w-100">See All Notifications</button>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link pe-0" href="#" id="drop1" data-bs-toggle="dropdown" aria-expanded="false">
                                            <div className="d-flex align-items-center">
                                                <div className="user-profile-Image">
                                                    <Image src="/assets/images/profile/user-1.jpg" alt="User Profile" className="rounded-circle" width={35} height={35} />
                                                </div>
                                            </div>
                                        </a>
                                        <div className="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop1">
                                            <div className="profile-dropdown position-relative" data-simplebar>
                                                <div className="py-3 px-7 pb-0">
                                                    <h5 className="mb-0 fs-5 fw-semibold">Information</h5>
                                                </div>
                                                <div className="d-flex align-items-center py-9 mx-7 border-bottom">
                                                    <Image src="/assets/images/profile/user-1.jpg" alt="User Avatar" className="rounded-circle" width={80} height={80} />
                                                    <div className="ms-3">
                                                        <h5 className="mb-1 fs-3">Operator</h5>
                                                        <span className="mb-1 d-block">TVRI Transmitter Operator</span>
                                                    </div>
                                                </div>
                                                <div className="d-grid py-4 px-7 pt-8">
                                                    <a href="#" className="btn btn-outline-primary">Analytic Dashboard</a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
        </div>
    );
}
