"use client";
import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function CardChartBarCool({ data }) {
  // State untuk filter
  const [selectedYear, setSelectedYear] = useState("2025");
  const [viewMode, setViewMode] = useState("monthly"); // "monthly" atau "weekly"
  const [selectedColumn, setSelectedColumn] = useState("Cooling Temperature (°C)");

  const safeData = Array.isArray(data) ? data : [];

  // Pilihan kolom yang bisa ditampilkan
  const columnOptions = [
    "Cooling Temperature (°C)", "Cooling Liquid Flow (L/min)",
  ];

  // Proses data mentah menjadi rata-rata per bulan/minggu
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
      if (!month || !year) return;

      // Filter berdasarkan tahun terpilih
      if (String(year) !== selectedYear) return;

      const rawValue = row[selectedColumn];
      if (!rawValue) return;

      const value = Number(String(rawValue).replace(",", "."));
      if (isNaN(value)) return;

      let key;
      // Kelompokkan data per bulan atau minggu
      if (viewMode === "monthly") {
        key = `${year}-${String(month).padStart(2, "0")}`;
      } else {
        const dateObj = new Date(year, month - 1, day);
        const weekNumber = Math.ceil((day + dateObj.getDay()) / 7);
        key = `${year}-${String(month).padStart(2, "0")}-W${weekNumber}`;
      }

      if (!grouped[key]) grouped[key] = { total: 0, count: 0, month, year, key };

      grouped[key].total += value;
      grouped[key].count += 1;
    });

    // Hitung rata-rata dan urutkan data
    const result = Object.entries(grouped)
      .map(([key, { total, count, month, year }]) => {
        if (viewMode === "monthly") {
          return {
            label: new Date(year, month - 1).toLocaleString("id-ID", { month: "short" }),
            value: count > 0 ? Number((total / count).toFixed(2)) : 0,
            sortKey: month,
          };
        } else {
          const [_, m, wk] = key.match(/-(\d+)-W(\d+)/) || [];
          return {
            label: `${new Date(year, m - 1).toLocaleString("id-ID", { month: "short" })} W${wk}`,
            value: count > 0 ? Number((total / count).toFixed(2)) : 0,
            sortKey: Number(`${m}${wk.padStart(2, "0")}`),
          };
        }
      })
      .sort((a, b) => a.sortKey - b.sortKey);

    return result;
  }, [safeData, selectedYear, viewMode, selectedColumn]);

  return (
    <div className="col-12 col-md-6">
      <div className="card w-100">
        <div className="card-body">
          {/* Judul grafik */}
          <h6 className="fw-semibold mb-3 text-center">
            <i className="ti ti-chart-bar text-warning me-2 fw-bold"></i>
            {viewMode === "monthly"
              ? `Rata-Rata ${selectedColumn} Bulanan`
              : `Rata-Rata ${selectedColumn} Mingguan`}
          </h6>

          {/* Filter kolom, mode, tahun, dan tombol reset */}
          <div className="d-flex justify-content-center mb-3">
            <div className="d-flex align-items-center gap-2 flex-nowrap">
              <select className="form-select form-select-sm" value={selectedColumn} onChange={(e) => setSelectedColumn(e.target.value)} style={{ width: "180px" }}>
                {columnOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
              <select className="form-select form-select-sm" value={viewMode} onChange={(e) => setViewMode(e.target.value)} style={{ width: "120px" }}>
                <option value="monthly">Bulanan</option>
                <option value="weekly">Mingguan</option>
              </select>
              <select className="form-select form-select-sm" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ width: "100px" }}>
                {["2023", "2024", "2025", "2026"].map((y) => (<option key={y} value={y}>{y}</option>))}
              </select>
              <button className="btn btn-sm btn-outline-warning" onClick={() => { setSelectedYear("2025"); setViewMode("monthly"); setSelectedColumn("Video Output (Kw)"); }} title="Reset filter" style={{ whiteSpace: "nowrap" }}>
                <i className="ti ti-refresh"></i>
              </button>
            </div>
          </div>

          {/* Grafik batang */}
          <ResponsiveContainer width="100%" height={315}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="label" stroke="#ccc" tick={{ fontSize: 10, fill: "#666" }} interval={0} angle={-30} textAnchor="end" height={60} />
              <YAxis stroke="#ccc" tick={{ fontSize: 10, fill: "#666" }} />
              <Tooltip wrapperStyle={{ fontSize: "12px" }} formatter={(v) => [`${v}`, "Rata-rata"]} />
              <Bar dataKey="value" fill="#ffae1f" barSize={30} radius={[6, 6, 0, 0]} animationDuration={800}>
                <LabelList dataKey="value" position="top" fontSize={10} fill="#444" formatter={(v) => `${v}`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
