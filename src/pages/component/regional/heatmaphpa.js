"use client";
import React, { useState, useMemo } from "react";

export default function HeatmapReg({ data }) {
    const now = new Date();
    const [selectedMonthYear, setSelectedMonthYear] = useState(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    );
    const [selectedAmplifier, setSelectedAmplifier] = useState("Power Amplifier 1");

    const safeData = Array.isArray(data) ? data : [];
    const [selectedYear, selectedMonth] = selectedMonthYear.split("-").map(Number);

    // Ambil daftar daerah unik dari kolom "Satuan Transmisi Daerah"
    const uniqueRegions = useMemo(() => {
        const regions = safeData
            .map((d) => d["Satuan Transmisi Daerah"])
            .filter(Boolean)
            .map((r) => r.trim());
        return [...new Set(regions)];
    }, [safeData]);

    // Ambil tanggal unik dari kolom "Tanggal_Fix" sesuai bulan yang dipilih
    const uniqueDates = useMemo(() => {
        const dates = safeData
            .map((d) => d["Tanggal_Fix"])
            .filter(Boolean)
            .map((tgl) => {
                const [m, day, y] = tgl.split("/").map(Number);
                if (y === selectedYear && m === selectedMonth) return day;
                return null;
            })
            .filter(Boolean)
            .sort((a, b) => a - b);
        return [...new Set(dates)];
    }, [safeData, selectedMonth, selectedYear]);

    // Ambil status amplifier berdasarkan tanggal dan daerah
    const getStatus = (amp, day, region) => {
        const filtered = safeData.filter((row) => {
            const tanggalFix = row["Tanggal_Fix"];
            if (!tanggalFix) return false; // abaikan jika kosong

            const parts = tanggalFix.split("/").map(Number);
            if (parts.length !== 3) return false; // format tidak sesuai

            const [m, d, y] = parts;
            return (
                y === selectedYear &&
                m === selectedMonth &&
                d === day &&
                row["Satuan Transmisi Daerah"]?.trim() === region
            );
        });

        if (filtered.length === 0) return "TIDAK ADA";

        const statuses = filtered
            .map((r) => (r[amp] ? r[amp].toString().trim().toUpperCase() : "TIDAK ADA"))
            .filter(Boolean);

        if (statuses.every((s) => s === "OK")) return "OK";
        if (statuses.some((s) => s === "NOT OK")) return "NOT OK";
        return "TIDAK ADA";
    };

    // Warna sel berdasarkan status
    const getCellStyle = (status) => {
        switch (status) {
            case "OK":
                return { backgroundColor: "#28c76f", color: "white" };
            case "NOT OK":
                return { backgroundColor: "#ea5455", color: "white" };
            default:
                return { backgroundColor: "#f8f9fa", color: "#999" };
        }
    };

    const amplifiers = [
        "Power Amplifier 1",
        "Power Amplifier 2",
        "Power Amplifier 3",
        "Power Amplifier 4",
        "Power Amplifier 5",
        "Power Amplifier 6",
    ];

    return (
        <div className="card mt-3 shadow-sm">
            <div className="card-body">
                {/* Header & Filter */}
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h6 className="fw-semibold mb-0">
                        <i className="ti ti-table text-primary me-2"></i>
                        Heatmap Kondisi Power Amplifier per Daerah
                    </h6>

                    <div className="d-flex gap-2">
                        <select
                            className="form-select form-select-sm"
                            style={{ width: "180px" }}
                            value={selectedAmplifier}
                            onChange={(e) => setSelectedAmplifier(e.target.value)}
                        >
                            {amplifiers.map((amp) => (
                                <option key={amp} value={amp}>
                                    {amp}
                                </option>
                            ))}
                        </select>

                        <input
                            type="month"
                            className="form-control form-control-sm"
                            style={{ width: "160px" }}
                            value={selectedMonthYear}
                            onChange={(e) => setSelectedMonthYear(e.target.value)}
                        />
                    </div>
                </div>

                {/* TABEL */}
                <div className="table-responsive">
                    <table className="table table-bordered text-center align-middle mb-0">
                        <thead>
                            <tr>
                                <th style={{ minWidth: "180px" }}>Satuan Transmisi Daerah</th>
                                {uniqueDates.map((d) => (
                                    <th key={d}>{d}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {uniqueRegions.map((region) => (
                                <tr key={region}>
                                    <th className="text-start fw-semibold">{region}</th>
                                    {uniqueDates.map((day) => {
                                        const status = getStatus(selectedAmplifier, day, region);
                                        const style = getCellStyle(status);
                                        return (
                                            <td
                                                key={`${day}-${region}`}
                                                style={{
                                                    fontSize: "0.55rem",
                                                    padding: "6px",
                                                    minWidth: "48px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {status === "TIDAK ADA" ? (
                                                    "-"
                                                ) : (
                                                    <span
                                                        className={`${status === "OK"
                                                                ? "bg-success text-white"
                                                                : status === "NOT OK"
                                                                    ? "bg-danger text-white"
                                                                    : "bg-secondary text-white"
                                                            }`}
                                                        style={{
                                                            display: "inline-block",
                                                            padding: "4px 8px",
                                                            borderRadius: "6px",
                                                            fontWeight: "600",
                                                            minWidth: "40px",
                                                        }}
                                                    >
                                                        {status}
                                                    </span>
                                                )}
                                            </td>

                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Legenda */}
                <div className="text-center mt-3 small text-muted">
                    <span className="me-3">
                        <span
                            className="badge bg-success text-white me-1"
                            style={{ fontSize: "0.55rem" }}
                        >
                            OK
                        </span>
                        Berfungsi Normal
                    </span>
                    <span className="me-3">
                        <span
                            className="badge bg-danger text-white me-1"
                            style={{ fontSize: "0.55rem" }}
                        >
                            Not OK
                        </span>
                        Terjadi Gangguan
                    </span>
                    <span>
                        <span
                            className="badge bg-secondary text-white me-1"
                            style={{ fontSize: "0.55rem" }}
                        >
                            -
                        </span>
                        Data Tidak Ada
                    </span>
                </div>
            </div>
        </div>
    );
}
