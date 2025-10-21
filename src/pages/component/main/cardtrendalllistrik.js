"use client";
import React, { useMemo, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function Cardtrendlistrikall({ data }) {
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedType, setSelectedType] = useState("EI");

    const safeData = Array.isArray(data) ? data : [];
    const chartData = useMemo(() => {
        const grouped = {};

        safeData.forEach((row) => {
            const tglRaw = row["Tgl"];
            if (!tglRaw) return;

            const parts = tglRaw.toString().split("/");
            if (parts.length < 3) return;

            const month = Number(parts[0]);
            const day = Number(parts[1]);
            const year = Number(parts[2]);
            if (!day || !month || !year) return;

            const monthKey = `${year}-${String(month).padStart(2, "0")}`;
            if (selectedMonth && monthKey !== selectedMonth) return;

            const dateKey = `${String(day).padStart(2, "0")}/${String(month).padStart(
                2,
                "0"
            )}/${year}`;

            if (!grouped[dateKey])
                grouped[dateKey] = {
                    tanggal: dateKey,
                    _dateObj: new Date(year, month - 1, day),
                };

            let keys = [];
            if (selectedType === "EI") keys = ["R - N", "S - N", "T - N"];
            else if (selectedType === "EO") keys = ["R - N (1)", "S - N (1)", "T - N (1)"];
            else if (selectedType === "NU") keys = ["R-S (U12)", "S-T (U23)", "T-R (U31)"];
            else if (selectedType === "NV") keys = ["R-N (V1)", "S-N (V2)", "T-N (V3)"];

            const values = keys
                .map((key) => {
                    const val = Number(String(row[key]).replace(",", "."));
                    return isNaN(val) ? null : val;
                })
                .filter((v) => v !== null);

            const avg =
                values.length > 0
                    ? values.reduce((sum, v) => sum + v, 0) / values.length
                    : null;

            grouped[dateKey].rataRata = avg;
        });

        return Object.values(grouped)
            .sort((a, b) => a._dateObj - b._dateObj)
            .map(({ _dateObj, ...rest }) => rest);
    }, [safeData, selectedMonth, selectedType]);

    const yDomain =
        selectedType === "NU"
            ? [375, 380]
            : selectedType === "NV"
                ? [215, 220]
                : [200, 235];

    const color = "#539bff";

    return (
        <div className="col-12 col-md-6">
            <div className="card w-100" style={{ height: "460px" }}>
                <div className="card-body">
                    {/* Judul */}
                    <h6 className="fw-semibold mb-3 text-center">
                        <i className="ti ti-bolt text-info me-2 fw-bold"></i>
                        Rata-Rata Penggunaan Listrik{" "} 
                        {selectedType === "EI"
                            ? "Electrosys Input"
                            : selectedType === "EO"
                                ? "Electrosys Output"
                                : selectedType === "NU"
                                    ? "NEC - U"
                                    : "NEC - V"} (KWatt)
                    </h6>

                    {/* Filter */}
                    <div className="d-flex justify-content-center align-items-center mb-3 gap-2 flex-nowrap">
                        <input
                            type="month"
                            className="form-control form-control-sm"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{ width: "150px" }}
                        />
                        <select
                            className="form-select form-select-sm"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            style={{ width: "180px" }}
                        >
                            <option value="EI">Electrosys Input</option>
                            <option value="EO">Electrosys Output</option>
                            <option value="NU">NEC - U</option>
                            <option value="NV">NEC - V</option>
                        </select>
                        <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => {
                                setSelectedMonth("");
                                setSelectedType("EI");
                            }}
                            title="Reset filter"
                        >
                            <i className="ti ti-refresh"></i>
                        </button>
                    </div>

                    {/* Grafik */}
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="10%" stopColor={color} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis
                                dataKey="tanggal"
                                stroke="#ccc"
                                tick={{ fontSize: 10, fill: "#666" }}
                                angle={-30}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis
                                stroke="#ccc"
                                domain={yDomain}
                                tick={{ fontSize: 10, fill: "#666" }}
                            />
                            <Tooltip
                                wrapperStyle={{ fontSize: "12px" }}
                                formatter={(value) =>
                                    value != null ? value.toFixed(2) : "-"
                                }
                            />

                            <Area
                                type="monotone"
                                dataKey="rataRata"
                                stroke={color}
                                strokeWidth={2}
                                fill="url(#colorAvg)"
                                dot={({ r: 2, fill: color })}
                                isAnimationActive={true}
                                animationDuration={800}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
