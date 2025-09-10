import React from 'react'

export default function header() {
    return (
        <div>
            <header class="topbar">
                <div class="with-vertical">
                    <nav class="navbar navbar-expand-lg p-0">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a
                                    class="nav-link sidebartoggler nav-icon-hover ms-n3"
                                    id="headerCollapse"
                                    href="#">
                                    <i class="ti ti-menu-2"></i>
                                </a>
                            </li>
                        </ul>

                        <div class="d-block d-lg-none">
                            <img src="./assets/images/logos/dark-logo.svg" width="180"
                                alt />
                        </div>
                        <a
                            class="navbar-toggler nav-icon-hover p-0 border-0"
                            href="#"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation">
                            <span class="p-2">
                                <i class="ti ti-dots fs-7"></i>
                            </span>
                        </a>
                        <div class="collapse navbar-collapse justify-content-end"
                            id="navbarNav">
                            <div class="d-flex align-items-center justify-content-between">
                                <a
                                    href="#"
                                    class="nav-link d-flex d-lg-none align-items-center justify-content-center"
                                    type="button"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#mobilenavbar"
                                    aria-controls="offcanvasWithBothOptions">
                                    <i class="ti ti-align-justified fs-7"></i>
                                </a>
                                <ul
                                    class="navbar-nav flex-row ms-auto align-items-center justify-content-center">
                                    
                                    <li class="nav-item dropdown">
                                        <a
                                            class="nav-link nav-icon-hover"
                                            href="#"
                                            id="drop2"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false">
                                            <i class="ti ti-bell-ringing"></i>
                                            <div
                                                class="notification bg-primary rounded-circle"></div>
                                        </a>
                                        <div
                                            class="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up"
                                            aria-labelledby="drop2">
                                            <div
                                                class="d-flex align-items-center justify-content-between py-3 px-7">
                                                <h5 class="mb-0 fs-5 fw-semibold">Notifications</h5>
                                                <span
                                                    class="badge text-bg-primary rounded-4 px-3 py-1 lh-sm">5
                                                    new</span>
                                            </div>
                                            <div class="message-body" data-simplebar>
                                              
                                            </div>
                                            <div class="py-6 px-7 mb-1">
                                                <button class="btn btn-outline-primary w-100">See All
                                                    Notifications</button>
                                            </div>

                                        </div>
                                    </li>
                                    <li class="nav-item dropdown">
                                        <a
                                            class="nav-link pe-0"
                                            href="#"
                                            id="drop1"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false">
                                            <div class="d-flex align-items-center">
                                                <div class="user-profile-img">
                                                    <img
                                                        src="./assets/images/profile/user-1.jpg"
                                                        class="rounded-circle"
                                                        width="35"
                                                        height="35"
                                                        alt />
                                                </div>
                                            </div>
                                        </a>
                                        <div class="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up"
                                            aria-labelledby="drop1">
                                            <div class="profile-dropdown position-relative"
                                                data-simplebar>
                                                <div class="py-3 px-7 pb-0">
                                                    <h5 class="mb-0 fs-5 fw-semibold">Information</h5>
                                                </div>
                                                <div
                                                    class="d-flex align-items-center py-9 mx-7 border-bottom">
                                                    <img
                                                        src="./assets/images/profile/user-1.jpg"
                                                        class="rounded-circle"
                                                        width="80"
                                                        height="80"
                                                        alt />
                                                    <div class="ms-3">
                                                        <h5 class="mb-1 fs-3">Operator</h5>
                                                        <span class="mb-1 d-block">TVRi Transmitter Operator</span>
                                                    </div>
                                                </div>
                                                <div class="d-grid py-4 px-7 pt-8">
                                                    <a href="./main/authentication-login.html"
                                                        class="btn btn-outline-primary">Log Out</a>
                                                </div>
                                            </div>

                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div class="offcanvas offcanvas-start"
                        data-bs-scroll="true"
                        tabindex="-1"
                        id="mobilenavbar"
                        aria-labelledby="offcanvasWithBothOptionsLabel">
                        <nav class="sidebar-nav scroll-sidebar">
                            <div class="offcanvas-header justify-content-between">
                                <img src="./assets/images/logos/favicon.ico" alt
                                    class="img-fluid" />
                                <button
                                    type="button"
                                    class="btn-close"
                                    data-bs-dismiss="offcanvas"
                                    aria-label="Close"></button>
                            </div>
                            <div
                                class="offcanvas-body"
                                data-simplebar
                                style={{ height: "100%" }}>
                            </div>
                        </nav>
                    </div>

                </div>
                <div class="app-header with-horizontal">
                    <nav class="navbar navbar-expand-xl container-fluid p-0">
                        <ul class="navbar-nav">
                            <li class="nav-item d-block d-xl-none">
                                <a
                                    class="nav-link sidebartoggler ms-n3"
                                    id="sidebarCollapse"
                                    href="#">
                                    <i class="ti ti-menu-2"></i>
                                </a>
                            </li>
                            <li class="nav-item d-none d-xl-block">
                                <a href="./main/index.html" class="text-nowrap nav-link">
                                    <img
                                        src="./assets/images/logos/dark-logo.svg"
                                        class="dark-logo"
                                        width="180"
                                        alt />
                                </a>
                            </li>
                        </ul>
                        <div class="d-block d-xl-none">
                            <a href="./main/index.html" class="text-nowrap nav-link">
                                <img src="./assets/images/logos/dark-logo.svg" width="180"
                                    alt />
                            </a>
                        </div>
                        <a
                            class="navbar-toggler nav-icon-hover p-0 border-0"
                            href="#"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation">
                            <span class="p-2">
                                <i class="ti ti-dots fs-7"></i>
                            </span>
                        </a>
                        <div class="collapse navbar-collapse justify-content-end"
                            id="navbarNav">
                            <div
                                class="d-flex align-items-center justify-content-between px-0 px-xl-8">
                                <a
                                    href="#"
                                    class="nav-link round-40 p-1 ps-0 d-flex d-xl-none align-items-center justify-content-center"
                                    type="button"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#mobilenavbar"
                                    aria-controls="offcanvasWithBothOptions">
                                    <i class="ti ti-align-justified fs-7"></i>
                                </a>
                                <ul class="navbar-nav flex-row ms-auto align-items-center justify-content-center">
                                    <li class="nav-item dropdown">
                                        <a
                                            class="nav-link nav-icon-hover"
                                            href="#"
                                            id="drop2"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false">
                                            <i class="ti ti-bell-ringing"></i>
                                            <div
                                                class="notification bg-primary rounded-circle"></div>
                                        </a>
                                        <div
                                            class="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up"
                                            aria-labelledby="drop2">
                                            <div
                                                class="d-flex align-items-center justify-content-between py-3 px-7">
                                                <h5 class="mb-0 fs-5 fw-semibold">Notifications</h5>
                                                <span
                                                    class="badge text-bg-primary rounded-4 px-3 py-1 lh-sm">5
                                                    new</span>
                                            </div>
                                            <div class="message-body" data-simplebar>
                                               
                                            </div>
                                            <div class="py-6 px-7 mb-1">
                                                <button class="btn btn-outline-primary w-100">See All
                                                    Notifications</button>
                                            </div>

                                        </div>
                                    </li>
                                    <li class="nav-item dropdown">
                                        <a
                                            class="nav-link pe-0"
                                            href="#"
                                            id="drop1"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false">
                                            <div class="d-flex align-items-center">
                                                <div class="user-profile-img">
                                                    <img
                                                        src="./assets/images/profile/user-1.jpg"
                                                        class="rounded-circle"
                                                        width="35"
                                                        height="35"
                                                        alt />
                                                </div>
                                            </div>
                                        </a>
                                        <div class="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up"
                                            aria-labelledby="drop1">
                                            <div class="profile-dropdown position-relative"
                                                data-simplebar>
                                                <div class="py-3 px-7 pb-0">
                                                    <h5 class="mb-0 fs-5 fw-semibold">Information</h5>
                                                </div>
                                                <div
                                                    class="d-flex align-items-center py-9 mx-7 border-bottom">
                                                    <img
                                                        src="./assets/images/profile/user-1.jpg"
                                                        class="rounded-circle"
                                                        width="80"
                                                        height="80"
                                                        alt />
                                                    <div class="ms-3">
                                                        <h5 class="mb-1 fs-3">Operator</h5>
                                                        <span class="mb-1 d-block">TVRI Transmitter Operator</span>
                                                    </div>
                                                </div>
                                                <div class="d-grid py-4 px-7 pt-8">
                                                    <a href="#"
                                                        class="btn btn-outline-primary">Analytic Dashboard</a>
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
    )
}
