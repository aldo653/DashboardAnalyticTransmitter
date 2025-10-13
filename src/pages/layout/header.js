"use client";
import React from "react";
import Image from "next/image";
import { useTransmitterData } from "../api/fetchController";

export default function Header() {
    // Memanggil hook dengan benar
    const { data, loading } = useTransmitterData();

    // Filter data > 4 untuk kolom tertentu
    const filteredData = data?.filter((item) => {
        const nasional = parseFloat(item["TVRI NASIONAL"]?.toString().replace(',', '.')) > 4;
        const sumsel = parseFloat(item["TVRI SUMSEL"]?.toString().replace(',', '.')) > 4;
        const sport = parseFloat(item["TVRI SPORT"]?.toString().replace(',', '.')) > 4;
        const world = parseFloat(item["TVRI WORLD"]?.toString().replace(',', '.')) > 4;
        const rtv = parseFloat(item["RTV"]?.toString().replace(',', '.')) > 4;
        const btv = parseFloat(item["BTV"]?.toString().replace(',', '.')) > 2;
        const mdtv = parseFloat(item["MDTV"]?.toString().replace(',', '.')) > 4;
        const rcti = parseFloat(item["RCTI"]?.toString().replace(',', '.')) > 4;
        const paltv = parseFloat(item["PAL TV"]?.toString().replace(',', '.')) > 2;
        return nasional || sumsel || sport || world || rtv || btv || mdtv || rcti || paltv;
    }).map((item) => ({
        tanggal: item["Tgl"] || "-",
        petugas: item["Petugas"] || "-",
        nasional: item["TVRI NASIONAL"],
        sumsel: item["TVRI SUMSEL"],
        sport: item["TVRI SPORT"],
        world: item["TVRI WORLD"],
        rtv: item["RTV"],
        btv: item["BTV"],
        mdtv: item["MDTV"],
        rcti: item["RCTI"],
        paltv: item["PAL TV"],
    }));

    return (
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
                                        {filteredData?.length > 0 && (
                                            <div className="notification bg-primary rounded-circle"></div>
                                        )}
                                    </a>

                                    <div className="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                                        <div className="d-flex align-items-center justify-content-between py-3 px-7">
                                            <h5 className="mb-0 fs-5 fw-semibold">Notifications</h5>
                                        </div>

                                        <div className="message-body" data-simplebar>
                                            <ul className="list-group list-group-flush">
                                                {loading ? (
                                                    <li className="list-group-item bg-transparent text-muted">
                                                        Loading data ...
                                                    </li>
                                                ) : filteredData?.length > 0 ? (
                                                    filteredData.map((row, idx) => (
                                                        <div key={idx} className="bg-transparent m-2 ms-4">
                                                            <a href="#" className="d-flex align-items-center gap-3 text-decoration-none">
                                                                <div className="notify bg-light-danger d-flex align-items-center justify-content-center p-2 rounded">
                                                                    <i className="ti ti-alert-triangle text-danger"></i>
                                                                </div>
                                                                <div>
                                                                    <strong>
                                                                        {new Date(row.tanggal).toLocaleDateString("id-ID", {
                                                                            day: "numeric",
                                                                            month: "long",
                                                                            year: "numeric",
                                                                        })}
                                                                    </strong>
                                                                    <div className="small text-muted mt-1">
                                                                        {parseFloat(row.nasional?.toString().replace(',', '.')) > 4 && (
                                                                            <div>TVRI NASIONAL - {row.nasional} - {row.petugas}</div>
                                                                        )}
                                                                        {parseFloat(row.sumsel?.toString().replace(',', '.')) > 4 && (
                                                                            <div>TVRI SUMSEL - {row.sumsel} - {row.petugas}</div>
                                                                        )}
                                                                        {parseFloat(row.sport?.toString().replace(',', '.')) > 4 && (
                                                                            <div>TVRI SPORT - {row.sport} - {row.petugas}</div>
                                                                        )}
                                                                        {parseFloat(row.world?.toString().replace(',', '.')) > 4 && (
                                                                            <div>TVRI WORLD - {row.world} - {row.petugas}</div>
                                                                        )}
                                                                        {parseFloat(row.rtv?.toString().replace(',', '.')) > 4 && (
                                                                            <div>RTV - {row.rtv} - {row.petugas}</div>
                                                                        )}
                                                                        {parseFloat(row.btv?.toString().replace(',', '.')) > 2 && (
                                                                            <div>BTV - {row.btv} - {row.petugas}</div>
                                                                        )}
                                                                        {parseFloat(row.mdtv?.toString().replace(',', '.')) > 4 && (
                                                                            <div>MDTV - {row.mdtv} - {row.petugas}</div>
                                                                        )}
                                                                        {parseFloat(row.rcti?.toString().replace(',', '.')) > 4 && (
                                                                            <div>RCTI - {row.rcti} - {row.petugas}</div>
                                                                        )}
                                                                        {parseFloat(row.paltv?.toString().replace(',', '.')) > 2 && (
                                                                            <div>PAL TV - {row.paltv} - {row.petugas}</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="list-group-item bg-transparent text-muted">
                                                        No notifications
                                                    </div>
                                                )}
                                            </ul>
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
            <div className="app-header with-horizontal">
                <nav className="navbar navbar-expand-xl container-fluid p-0">
                    {/* Logo dan menu utama */}
                    <ul className="navbar-nav align-items-center">
                        <li className="nav-item d-block d-xl-none">
                            <a className="nav-link sidebartoggler ms-n3" id="sidebarCollapse" href="#">
                                <i className="ti ti-menu-2"></i>
                            </a>
                        </li>
                        <li className="nav-item d-none d-xl-flex align-items-center">
                            <a href="./main/index.html" className="text-nowrap nav-link d-flex align-items-center">
                                <Image src="/assets/asset/main_logo.svg" alt="Main Logo" className="dark-logo" width={180} height={60} />
                                <h6 className="ms-2 fw-bold">
                                    <strong>Transmission Analytic Dashboard</strong>
                                </h6>
                            </a>
                        </li>
                    </ul>

                    {/* Collapse untuk mobile */}
                    <div className="d-block d-xl-none">
                        <a href="./main/index.html" className="text-nowrap nav-link">
                            <Image src="/assets/asset/main_logo.svg" alt="Main Logo" width={180} height={60} />
                        </a>
                    </div>

                    <a
                        className="navbar-toggler nav-icon-hover p-0 border-0"
                        href="#"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="p-2">
                            <i className="ti ti-dots fs-7"></i>
                        </span>
                    </a>

                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <div className="d-flex align-items-center justify-content-between px-0 px-xl-8">
                            <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-center">
                                {/* === Notification Dropdown === */}
                                <li className="nav-item dropdown">
                                    <a className="nav-link nav-icon-hover" href="#" id="drop2" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="ti ti-bell-ringing"></i>
                                        {filteredData?.length > 0 && (
                                            <div className="notification bg-primary rounded-circle"></div>
                                        )}
                                    </a>

                                    <div className="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                                        <div className="d-flex align-items-center justify-content-between py-3 px-7">
                                            <h5 className="mb-0 fs-5 fw-semibold">Notifications</h5>
                                        </div>

                                        <div className="message-body" data-simplebar>
                                            <ul className="list-group list-group-flush">
                                                {loading ? (
                                                    <li className="list-group-item bg-transparent text-muted">
                                                        Loading data ...
                                                    </li>
                                                ) : filteredData?.length > 0 ? (
                                                    filteredData.map((row, idx) => (
                                                        <div key={idx} className="bg-transparent m-2 ms-4">
                                                            <a href="#" className="d-flex align-items-center gap-3 text-decoration-none">
                                                                <div className="notify bg-light-danger d-flex align-items-center justify-content-center p-2 rounded">
                                                                    <i className="ti ti-alert-triangle text-danger"></i>
                                                                </div>
                                                                <div>
                                                                    <strong>
                                                                        {new Date(row.tanggal).toLocaleDateString("id-ID", {
                                                                            day: "numeric",
                                                                            month: "long",
                                                                            year: "numeric",
                                                                        })}
                                                                    </strong>
                                                                    <div className="small text-muted mt-1">
                                                                        {parseFloat(row.nasional?.toString().replace(',', '.')) > 4 && (
                                                                            <div>TVRI NASIONAL - {row.nasional} - {row.petugas}</div>
                                                                        )}
                                                                        {parseFloat(row.sumsel?.toString().replace(',', '.')) > 4 && (
                                                                            <div>TVRI SUMSEL - {row.sumsel} - {row.petugas}</div>
                                                                        )}
                                                                        {parseFloat(row.sport?.toString().replace(',', '.')) > 4 && (
                                                                            <div>TVRI SPORT - {row.sport} - {row.petugas}</div>
                                                                        )}
                                                                        {parseFloat(row.world?.toString().replace(',', '.')) > 4 && (
                                                                            <div>TVRI WORLD - {row.world} - {row.petugas}</div>
                                                                        )}
                                                                        {parseFloat(row.rtv?.toString().replace(',', '.')) > 4 && (
                                                                            <div>RTV - {row.rtv} - {row.petugas}</div>
                                                                        )}
                                                                        {parseFloat(row.btv?.toString().replace(',', '.')) > 2 && (
                                                                            <div>BTV - {row.btv} - {row.petugas}</div>
                                                                        )}
                                                                        {parseFloat(row.mdtv?.toString().replace(',', '.')) > 4 && (
                                                                            <div>MDTV - {row.mdtv} - {row.petugas}</div>
                                                                        )}
                                                                        {parseFloat(row.rcti?.toString().replace(',', '.')) > 4 && (
                                                                            <div>RCTI - {row.rcti} - {row.petugas}</div>
                                                                        )}
                                                                        {parseFloat(row.paltv?.toString().replace(',', '.')) > 2 && (
                                                                            <div>PAL TV - {row.paltv} - {row.petugas}</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="list-group-item bg-transparent text-muted">
                                                        No notifications
                                                    </div>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </li>

                                {/* === Profile Dropdown === */}
                                <li className="nav-item dropdown">
                                    <a className="nav-link pe-0" href="#" id="drop1" data-bs-toggle="dropdown" aria-expanded="false">
                                        <div className="d-flex align-items-center">
                                            <div className="user-profile-Image">
                                                <Image
                                                    src="/assets/images/profile/user-1.jpg"
                                                    alt="User Profile"
                                                    className="rounded-circle"
                                                    width={35}
                                                    height={35}
                                                />
                                            </div>
                                        </div>
                                    </a>
                                    <div className="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop1">
                                        <div className="profile-dropdown position-relative" data-simplebar>
                                            <div className="py-3 px-7 pb-0">
                                                <h5 className="mb-0 fs-5 fw-semibold">Information</h5>
                                            </div>
                                            <div className="d-flex align-items-center py-9 mx-7 border-bottom">
                                                <Image
                                                    src="/assets/images/profile/user-1.jpg"
                                                    alt="User Avatar"
                                                    className="rounded-circle"
                                                    width={80}
                                                    height={80}
                                                />
                                                <div className="ms-3">
                                                    <h5 className="mb-1 fs-3">Operator</h5>
                                                    <span className="mb-1 d-block">TVRI Transmitter Operator</span>
                                                </div>
                                            </div>
                                            <div className="d-grid py-4 px-7 pt-8">
                                                <a href="#" className="btn btn-outline-primary">
                                                    Analytic Dashboard
                                                </a>
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
    );
}
