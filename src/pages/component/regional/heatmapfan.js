"use client";
import React, { useState, useMemo } from "react";

export default function HeatmapRegPump({ data }) {
    const now = new Date();
    const [selectedMonthYear, setSelectedMonthYear] = useState(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    );

    // Default pilih "Pump 1"
    const [selectedDevice, setSelectedDevice] = useState("Pump 1");

    const safeData = Array.isArray(data) ? data : [];
    const [selectedYear, selectedMonth] = selectedMonthYear.split("-").map(Number);

    // Ambil daftar daerah unik
    const uniqueRegions = useMemo(() => {
        const regions = safeData
            .map((d) => d["Satuan Transmisi Daerah"])
            .filter(Boolean)
            .map((r) => r.trim());
        return [...new Set(regions)];
    }, [safeData]);

    // Ambil daftar tanggal unik dari kolom "Tanggal_Fix"
    const uniqueDates = useMemo(() => {
        const dates = safeData
            .map((d) => d["Tanggal_Fix"])
            .filter(Boolean)
            .map((tgl) => {
                const parts = tgl.split("/").map(Number);
                if (parts.length !== 3) return null;
                const [m, day, y] = parts;
                if (y === selectedYear && m === selectedMonth) return day;
                return null;
            })
            .filter(Boolean)
            .sort((a, b) => a - b);
        return [...new Set(dates)];
    }, [safeData, selectedMonth, selectedYear]);

    const devices = ["Pump 1", "Pump 2", "Fan 1", "Fan 2"];

    // Fungsi ambil status
    const getStatus = (device, day, region) => {
        const filtered = safeData.filter((row) => {
            const tanggalFix = row["Tanggal_Fix"];
            if (!tanggalFix) return false;

            const parts = tanggalFix.split("/").map(Number);
            if (parts.length !== 3) return false;

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
            .map((r) => (r[device] ? r[device].toString().trim().toUpperCase() : "TIDAK ADA"))
            .filter(Boolean);

        if (statuses.every((s) => s === "OK")) return "OK";
        if (statuses.some((s) => s === "NOT OK")) return "NOT OK";
        return "TIDAK ADA";
    };

    return (
        <div className="card mt-3 shadow-sm">
            <div className="card-body">
                {/* Header & Filter */}
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h6 className="fw-semibold mb-0">
                        <i className="ti ti-table text-primary me-2"></i>
                        Heatmap Kondisi Pump/Fan per Daerah
                    </h6>

                    <div className="d-flex gap-2">
                        <select
                            className="form-select form-select-sm"
                            style={{ width: "180px" }}
                            value={selectedDevice}
                            onChange={(e) => setSelectedDevice(e.target.value)}
                        >
                            {devices.map((dev) => (
                                <option key={dev} value={dev}>
                                    {dev}
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
                                        const status = getStatus(selectedDevice, day, region);
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
                                                        className={`${
                                                            status === "OK"
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
