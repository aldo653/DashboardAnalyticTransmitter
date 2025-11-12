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

export default function CardBarOutput({ data }) {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [viewMode, setViewMode] = useState("monthly"); // "monthly" atau "weekly"
  const [selectedColumn, setSelectedColumn] = useState("Output(Rev) Kw");
  const [selectedRegion, setSelectedRegion] = useState("Prabumulih");

  const safeData = Array.isArray(data) ? data : [];

  // ✅ Ambil daftar unik dari kolom "Satuan Transmisi Daerah"
  const regionOptions = useMemo(() => {
    const unique = new Set();
    safeData.forEach((row) => {
      const val = row["Satuan Transmisi Daerah"];
      if (val && val.trim() !== "") unique.add(val.trim());
    });
    const list = Array.from(unique).sort();
    // Pastikan "Prabumulih" di urutan pertama jika ada
    if (list.includes("Prabumulih")) {
      return ["Prabumulih", ...list.filter((v) => v !== "Prabumulih")];
    }
    return list;
  }, [safeData]);

  const columnOptions = ["Output(Rev) Kw", "Reflected (Watt)"];

  // ✅ Filter dan olah data berdasarkan satuan transmisi & tahun terpilih
  const chartData = useMemo(() => {
    const grouped = {};

    safeData.forEach((row) => {
      const tglRaw = row["Tanggal_Fix"];
      const daerah = row["Satuan Transmisi Daerah"];
      if (!tglRaw || !daerah) return;

      if (daerah !== selectedRegion) return; // filter sesuai pilihan user

      const parts = tglRaw.toString().split("/");
      if (parts.length < 3) return;

      const month = Number(parts[0]);
      const day = Number(parts[1]);
      const year = Number(parts[2]);
      if (!month || !year) return;

      if (String(year) !== selectedYear) return;

      const rawValue = row[selectedColumn];
      if (!rawValue) return;

      const value = Number(String(rawValue).replace(",", "."));
      if (isNaN(value)) return;

      let key;
      if (viewMode === "monthly") {
        key = `${year}-${String(month).padStart(2, "0")}`;
      } else {
        const dateObj = new Date(year, month - 1, day);
        const weekNumber = Math.ceil((day + dateObj.getDay()) / 7);
        key = `${year}-${String(month).padStart(2, "0")}-W${weekNumber}`;
      }

      if (!grouped[key]) grouped[key] = { total: 0, count: 0, month, year };
      grouped[key].total += value;
      grouped[key].count += 1;
    });

    const result = Object.entries(grouped)
      .map(([key, { total, count, month, year }]) => {
        if (viewMode === "monthly") {
          return {
            label: new Date(year, month - 1).toLocaleString("id-ID", {
              month: "short",
            }),
            value: count > 0 ? Number((total / count).toFixed(2)) : 0,
            sortKey: month,
          };
        } else {
          const [_, m, wk] = key.match(/-(\d+)-W(\d+)/) || [];
          return {
            label: `${new Date(year, m - 1).toLocaleString("id-ID", {
              month: "short",
            })} W${wk}`,
            value: count > 0 ? Number((total / count).toFixed(2)) : 0,
            sortKey: Number(`${m}${wk.padStart(2, "0")}`),
          };
        }
      })
      .sort((a, b) => a.sortKey - b.sortKey);

    return result;
  }, [safeData, selectedYear, viewMode, selectedColumn, selectedRegion]);

  return (
    <div className="col-12 col-md-6">
      <div className="card w-100">
        <div className="card-body">
          <h6 className="fw-semibold mb-3 text-center">
            <i className="ti ti-chart-bar text-info me-2 fw-bold"></i>
            {viewMode === "monthly"
              ? `Rata-Rata ${selectedColumn} Bulanan ${selectedRegion}`
              : `Rata-Rata ${selectedColumn} Mingguan ${selectedRegion}`}
          </h6>

          {/* ✅ Dropdown filter sejajar, termasuk filter Satuan Transmisi Daerah */}
          <div className="d-flex justify-content-center mb-3">
            <div className="d-flex align-items-center gap-2 flex-nowrap flex-wrap justify-content-center">
              {/* Filter Satuan Transmisi Daerah */}
              <select
                className="form-select form-select-sm"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                
              >
                {regionOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              {/* Filter kolom data */}
              <select
                className="form-select form-select-sm"
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                
              >
                {columnOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              {/* Filter mode tampilan */}
              <select
                className="form-select form-select-sm"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                
              >
                <option value="monthly">Bulanan</option>
                <option value="weekly">Mingguan</option>
              </select>

              {/* Filter tahun */}
              <select
                className="form-select form-select-sm"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
               
              >
                {["2023", "2024", "2025", "2026"].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              {/* Tombol reset */}
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => {
                  setSelectedYear("2025");
                  setViewMode("monthly");
                  setSelectedColumn("Output(Rev) Kw");
                  setSelectedRegion("Prabumulih");
                }}
                title="Reset filter"
                style={{ whiteSpace: "nowrap" }}
              >
                <i className="ti ti-refresh"></i>
              </button>
            </div>
          </div>

          {/* Grafik Bar */}
          <ResponsiveContainer width="100%" height={315}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                dataKey="label"
                stroke="#ccc"
                tick={{ fontSize: 10, fill: "#666" }}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#ccc" tick={{ fontSize: 10, fill: "#666" }} />
              <Tooltip
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(v) => [`${v}`, "Rata-rata"]}
              />
              <Bar
                dataKey="value"
                fill="#539bff"
                barSize={30}
                radius={[6, 6, 0, 0]}
                animationDuration={800}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  fontSize={10}
                  fill="#444"
                  formatter={(v) => `${v}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
