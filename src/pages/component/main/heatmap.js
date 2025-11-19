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

    const tvriChannels = ["TVRI SUMSEL", "TVRI NASIONAL", "TVRI WORLD", "TVRI SPORT"];
    const mitraChannels = ["RTV", "RCTI", "MDTV", "BTV", "PAL TV"];

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

    // ---------------------------------------
    // 🔴 HITUNG PERSENTASE ABNORMAL
    // ---------------------------------------

    const calculateAbnormalStats = () => {
        let tvriTotal = 0, tvriAbnormal = 0;
        let mitraTotal = 0, mitraAbnormal = 0;

        channels.forEach((channel) => {
            uniqueDates.forEach((day) => {
                const val = getValue(channel, day);
                if (val === null) return;

                const limit = channel === "BTV" || channel === "PAL TV" ? 2 : 4;
                const isOver = val > limit;

                // kelompokkan
                if (tvriChannels.includes(channel)) {
                    tvriTotal++;
                    if (isOver) tvriAbnormal++;
                } else {
                    mitraTotal++;
                    if (isOver) mitraAbnormal++;
                }
            });
        });

        return {
            tvriPercent: tvriTotal ? (tvriAbnormal / tvriTotal) * 100 : 0,
            mitraPercent: mitraTotal ? (mitraAbnormal / mitraTotal) * 100 : 0,
        };
    };

    const { tvriPercent, mitraPercent } = calculateAbnormalStats();

    const formatMonthYear = (value) => {
        const [year, month] = value.split("-");
        const date = new Date(year, month - 1);
        return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    };

    return (
        <div className="card mt-3 shadow-sm">
            <div className="card-body">

                {/* Header */}
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
                        <span className="badge bg-success text-white me-1" style={{ fontSize: "0.75rem" }}>
                            Normal
                        </span>
                        ≤ 4 Mbps (Umum) / ≤ 2 Mbps (BTV, PAL TV)
                    </span>
                    <span>
                        <span className="badge bg-danger text-white me-1" style={{ fontSize: "0.75rem" }}>
                            Melebihi Batas
                        </span>
                        di atas 4 Mbps (Umum) / 2 Mbps (BTV, PAL TV)
                    </span>
                </div>

                {/* ----------------------------------------
                    🔥 INFO ABNORMALITAS DI BAWAH LEGEND
                ----------------------------------------- */}
                <div className="mt-3 text-center fw-semibold">
                    <p className="mb-1 text-danger">
                        {tvriPercent.toFixed(1)}% channel TVRI dengan bitrate melebihi batas di bulan {formatMonthYear(selectedMonthYear)}
                    </p>
                    <p className="mb-0 text-danger">
                        {mitraPercent.toFixed(1)}% channel Mitra dengan bitrate melebihi batas di bulan {formatMonthYear(selectedMonthYear)}
                    </p>
                </div>
            </div>
        </div>
    );
}
