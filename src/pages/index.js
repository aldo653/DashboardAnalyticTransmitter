"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Lottie from "lottie-react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // <-- LOADING BUTTON

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await new Promise((res) => setTimeout(res, 500)); // supaya spinner terlihat

    if (username === "operatortvrisumsel" && password === "tvriss2025") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/main");
    } else {
      setError("Username atau password salah.");
      setLoading(false);
    }
  };

  return (
    <div id="main-wrapper">
      <div className="position-relative overflow-hidden radial-gradient min-vh-100 w-100 d-flex align-items-center justify-content-center">
        <div className="d-flex align-items-center justify-content-center w-100">
          <div className="row justify-content-center w-100">

            {/* ---------------- LEFT LOGIN CARD ---------------- */}
            <div className="col-md-4 col-lg-4 col-xxl-4 d-flex justify-content-center">
              <ul className="list-unstyled">
                <li></li>
                <li>
                  <div className="card mb-0 w-100" style={{ marginTop: "15vh" }}>
                    <div className="card-body">

                      {/* LOGO */}
                      <ul className="list-unstyled d-flex flex-row justify-content-center align-items-center flex-wrap ms-3 m-3">
                        <li className="m-2 d-none d-md-block">
                          <Image src="/assets/asset/logo.png" width={70} height={40} alt="Logo TVRI" />
                        </li>
                        <li className="m-2 d-none d-md-block">
                          <Image src="/assets/asset/akhlak.png" width={100} height={40} alt="Logo Akhlak" />
                        </li>
                        <li className="m-2 d-none d-md-block">
                          <Image src="/assets/asset/logo_asn.png" width={90} height={40} alt="Logo ASN" />
                        </li>
                      </ul>

                      {/* FORM LOGIN */}
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="username" className="form-label">Username</label>
                          <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>

                        <div className="mb-4">
                          <label htmlFor="password" className="form-label">Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>

                        {error && (
                          <p className="text-danger" style={{ lineHeight: "1.2" }}>
                            {error}
                          </p>
                        )}

                        {/* BUTTON LOADING */}
                        <button
                          type="submit"
                          className="btn btn-primary w-100 py-2 mb-4 rounded-2 d-flex justify-content-center align-items-center"
                          disabled={loading}
                        >
                          {loading && (
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          )}
                          {loading ? "Processing..." : "Sign In"}
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
                <li></li>
              </ul>
            </div>

            {/* ---------------- RIGHT INFORMATION AREA ---------------- */}
            <div className="col-md-8 col-lg-8 col-xxl-6 d-flex justify-content-center" style={{ minHeight: "50vh" }}>
              <div className="card mb-0 bg-primary text-white" style={{ width: "100%", minHeight: "80vh" }}>
                <div className="card-body">

                  <div className="card mb-0 bg-transparent border-2 border-white" style={{ borderStyle: "dashed" }}>
                    <div className="card-body d-flex flex-column justify-content-center align-items-center">
                      <h4 className="card-title text-center text-white fw-bold">
                        Performance Reporting & Intelligent Smart Monitoring Analytics
                      </h4>
                      <h6 className="text-center text-white fw-bold">
                        TVRI Stasiun Sumatera Selatan
                      </h6>
                    </div>
                  </div>

                  <div className="card mb-0 bg-white text-primary" style={{ marginTop: "5%" }}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center flex-wrap">

                        {/* LEFT DESCRIPTION */}
                        <div
                          className="bg-transparent border-primary text-center d-flex flex-column justify-content-center align-items-center"
                          style={{
                            flex: "1 1 50%",
                            margin: "auto",
                            borderStyle: "dashed",
                            borderRadius: "10px",
                            padding: "20px",
                          }}
                        >
                          <h6 className="fw-bold mb-3">PRISMA</h6>
                          <p className="p-2 text-black" style={{ maxWidth: "80%" }}>
                            An intelligent dashboard platform designed to monitor,
                            analyze, and visualize performance data in real time.
                          </p>
                        </div>

                        {/* RIGHT ANIMATION */}
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ flex: "1 1 50%", minWidth: "300px" }}
                        >
                          <Lottie
                            animationData={require("../../public/assets/asset/bg-front.json")}
                            loop
                            autoplay
                            style={{ width: "90%", maxWidth: "350px" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="dark-transparent sidebartoggler"></div>
    </div>
  );
}
