"use client";
import React, { useState, useMemo } from "react";

export default function HeatmapTvri({ data }) {
    const now = new Date();
    const [selectedMonthYear, setSelectedMonthYear] = useState(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    );

    const channels = [
        "TVRI SUMSEL",
        "TVRI NASIONAL",
        "TVRI WORLD",
        "TVRI SPORT",
        "RTV",
        "RCTI",
        "MDTV",
        "BTV",
        "PAL TV",
    ];

    const safeData = Array.isArray(data) ? data : [];

    const [selectedYear, selectedMonth] = selectedMonthYear.split("-").map(Number);

    const uniqueDates = useMemo(() => {
        const dates = safeData
            .map((d) => d["Tgl"])
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

    // Hitung rata-rata bitrate per hari per channel
    const getValue = (channel, day) => {
        const filtered = safeData.filter((row) => {
            const [m, d, y] = row["Tgl"].split("/").map(Number);
            return y === selectedYear && m === selectedMonth && d === day;
        });

        if (filtered.length === 0) return null;

        const values = filtered
            .map((r) => parseFloat(String(r[channel] ?? "").replace(",", ".")))
            .filter((v) => !isNaN(v));

        if (values.length === 0) return null;

        return values.reduce((a, b) => a + b, 0) / values.length;
    };

    return (
        <div className="card mt-3 shadow-sm">
            <div className="card-body">
                {/* Header dan filter */}
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h6 className="fw-semibold mb-0">
                        <i className="ti ti-table text-primary me-2"></i>
                        Heatmap Bitrate Channel TVRI & Mitra (Mbps)
                    </h6>

                    <input
                        type="month"
                        className="form-control form-control-sm"
                        style={{ width: "160px" }}
                        value={selectedMonthYear}
                        onChange={(e) => setSelectedMonthYear(e.target.value)}
                    />
                </div>

                {/* TABEL */}
                <div className="table-responsive">
                    <table className="table table-bordered text-center align-middle mb-0">
                        <thead>
                            <tr>
                                <th style={{ minWidth: "140px" }}>Channel</th>
                                {uniqueDates.map((d) => (
                                    <th key={d}>{d}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {channels.map((channel) => (
                                <tr key={channel}>
                                    <th className="text-start fw-semibold">{channel}</th>
                                    {uniqueDates.map((day) => {
                                        const val = getValue(channel, day);

                                        // Batas: 2 Mbps untuk BTV & PAL TV, 4 Mbps untuk lainnya
                                        const limit =
                                            channel === "BTV" || channel === "PAL TV" ? 2 : 4;

                                        const isOverLimit = val !== null && val > limit;

                                        return (
                                            <td
                                                key={day}
                                                style={{
                                                    fontSize: "0.55rem",
                                                    padding: "6px",
                                                    minWidth: "48px",
                                                }}
                                            >
                                                {val !== null ? (
                                                    <span
                                                        className={`${isOverLimit
                                                            ? "bg-danger text-white"
                                                            : "bg-success text-white"
                                                            }`}
                                                        style={{
                                                            display: "inline-block",
                                                            padding: "4px 8px",
                                                            borderRadius: "6px",
                                                            fontWeight: "600",
                                                            minWidth: "40px",
                                                        }}
                                                    >
                                                        {val.toFixed(2)}
                                                    </span>
                                                ) : (
                                                    "-"
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
                            style={{ fontSize: "0.75rem" }}
                        >
                            Normal
                        </span>
                        ≤ 4 Mbps (Umum) / ≤ 2 Mbps (BTV, PAL TV)
                    </span>
                    <span>
                        <span
                            className="badge bg-danger text-white me-1"
                            style={{ fontSize: "0.75rem" }}
                        >
                            Melebihi Batas
                        </span>
                        diatas 4 Mbps (Umum) / 2 Mbps (BTV, PAL TV)
                    </span>
                </div>
            </div>
        </div>
    );
}
