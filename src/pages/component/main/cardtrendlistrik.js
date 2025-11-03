"use client";
import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Cardtrendlistrik({ data }) {
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

      // Kolom berdasarkan tipe
      let keys = [];
      if (selectedType === "EI") keys = ["R - N", "S - N", "T - N"];
      else if (selectedType === "EO") keys = ["R - N (1)", "S - N (1)", "T - N (1)"];
      else if (selectedType === "NU") keys = ["R-S (U12)", "S-T (U23)", "T-R (U31)"];
      else if (selectedType === "NV") keys = ["R-N (V1)", "S-N (V2)", "T-N (V3)"];

      keys.forEach((key) => {
        const rawVal = row[key];
        const value = Number(String(rawVal).replace(",", "."));
        grouped[dateKey][key] = isNaN(value) ? null : value;
      });
    });

    return Object.values(grouped)
      .sort((a, b) => a._dateObj - b._dateObj)
      .map(({ _dateObj, ...rest }) => rest);
  }, [safeData, selectedMonth, selectedType]);

  const lineKeys =
    selectedType === "EI"
      ? ["R - N", "S - N", "T - N"]
      : selectedType === "EO"
      ? ["R - N (1)", "S - N (1)", "T - N (1)"]
      : selectedType === "NU"
      ? ["R-S (U12)", "S-T (U23)", "T-R (U31)"]
      : ["R-N (V1)", "S-N (V2)", "T-N (V3)"];

  const colors = ["#539bff", "#28c76f", "#ff9f43"];

  // Domain YAxis berdasarkan tipe
  const yDomain =
    selectedType === "NU"
      ? [375, 385]
      : selectedType == "NV" 
      ? [215, 225] 
      : [200, 250]; // untuk EI, EO, dan NV

  return (
    <div className="col-12 col-md-6">
      <div className="card w-100" style={{ height: "460px" }}>
        <div className="card-body">
          {/* Judul */}
          <h6 className="fw-semibold mb-3 text-center">
            <i className="ti ti-bolt text-warning me-2 fw-bold"></i>
            Tegangan Listrik{" "} 
            {selectedType === "EI"
              ? "Electrosys Input"
              : selectedType === "EO"
              ? "Electrosys Output"
              : selectedType === "NU"
              ? "NEC - U"
              : "NEC - V"} (Volt)
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
              <option value="EI">Electrosys (In)</option>
              <option value="EO">Electrosys (Out)</option>
              <option value="NU">3 Phase (NEC)</option>
              <option value="NV">2 Phase (NEC)</option>
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
            <LineChart data={chartData}>
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
              <Tooltip wrapperStyle={{ fontSize: "12px" }} />

              {lineKeys.map((key, idx) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[idx]}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
