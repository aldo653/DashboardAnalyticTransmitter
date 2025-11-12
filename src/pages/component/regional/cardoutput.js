"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CardOutputReg({ data }) {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("Output(Rev) Kw");
  const [selectedUnit, setSelectedUnit] = useState("");
  const hasSetDefault = useRef(false); // 🔒 supaya default Prabumulih cuma sekali dijalankan

  useEffect(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    setSelectedMonth(currentMonth);
  }, []);

  const safeData = Array.isArray(data) ? data : [];

  // Ambil daftar unik satuan transmisi untuk dropdown
  const unitOptions = useMemo(() => {
    const units = new Set();
    safeData.forEach((row) => {
      if (row["Satuan Transmisi Daerah"]) {
        units.add(row["Satuan Transmisi Daerah"]);
      }
    });
    return Array.from(units);
  }, [safeData]);

  // 🟢 Set default ke "Prabumulih" HANYA SEKALI di awal
  useEffect(() => {
    if (!hasSetDefault.current && unitOptions.length > 0) {
      if (unitOptions.includes("Prabumulih")) {
        setSelectedUnit("Prabumulih");
      } else {
        setSelectedUnit(unitOptions[0]); // fallback jika Prabumulih tidak ada
      }
      hasSetDefault.current = true; // supaya tidak jalan lagi setelah itu
    }
  }, [unitOptions]);

  const chartData = useMemo(() => {
    const grouped = {};

    safeData.forEach((row) => {
      const tglRaw = row["Tanggal_Fix"];
      if (!tglRaw) return;

      // Filter berdasarkan unit yang dipilih
      if (selectedUnit && row["Satuan Transmisi Daerah"] !== selectedUnit)
        return;

      const parts = tglRaw.toString().split("/");
      if (parts.length < 3) return;

      const [month, day, year] = parts.map(Number);
      if (!day || !month || !year) return;

      const monthKey = `${year}-${String(month).padStart(2, "0")}`;
      if (selectedMonth && monthKey !== selectedMonth) return;

      const rawValue = row[selectedColumn];
      if (!rawValue) return;

      const value = Number(String(rawValue).replace(",", "."));
      if (isNaN(value)) return;

      const dateObj = new Date(year, month - 1, day);
      const dateKey = dateObj.toISOString().split("T")[0];

      if (!grouped[dateKey]) grouped[dateKey] = { total: 0, count: 0, dateObj };
      grouped[dateKey].total += value;
      grouped[dateKey].count += 1;
    });

    return Object.entries(grouped)
      .sort((a, b) => a[1].dateObj - b[1].dateObj)
      .map(([key, { total, count }]) => ({
        tanggal: key.split("-").reverse().join("/"),
        nilaiRata: count > 0 ? Number((total / count).toFixed(2)) : 0,
      }));
  }, [safeData, selectedMonth, selectedColumn, selectedUnit]);

  const columnOptions = ["Output(Rev) Kw", "Reflected (Watt)"];

  return (
    <div className="col-12 col-md-6">
      <div className="card w-100" style={{ height: "460px" }}>
        <div className="card-body">
          <h6 className="fw-semibold mb-3 text-center">
            <i className="ti ti-video text-danger me-2 fw-bold"></i>
            Rata-Rata {selectedColumn}{" "}
            {selectedUnit ? `- ${selectedUnit}` : ""}
          </h6>

          {/* Filter */}
          <div className="d-flex justify-content-center align-items-center mb-3 gap-2 flex-nowrap flex-wrap">
            <input
              type="month"
              className="form-control form-control-sm"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ width: "140px" }}
            />
            <select
              className="form-select form-select-sm"
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              style={{ width: "160px" }}
            >
              {columnOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <select
              className="form-select form-select-sm"
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              style={{ width: "150px" }}
            >
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => {
                setSelectedMonth("");
                setSelectedColumn("Output(Rev) Kw");
                setSelectedUnit("Prabumulih");
              }}
              title="Reset filter"
            >
              <i className="ti ti-refresh"></i>
            </button>
          </div>

          {/* Grafik area */}
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fa896b" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#fa896b" stopOpacity={0} />
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
              <YAxis stroke="#ccc" tick={{ fontSize: 10, fill: "#666" }} />
              <Tooltip wrapperStyle={{ fontSize: "12px" }} />
              <Area
                type="monotone"
                dataKey="nilaiRata"
                stroke="#fa896b"
                strokeWidth={1.5}
                fill="url(#colorArea)"
                activeDot={{
                  r: 4,
                  fill: "#fa896b",
                  stroke: "#fff",
                  strokeWidth: 1,
                }}
                dot={{ r: 2, fill: "#fa896b" }}
                isAnimationActive
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
