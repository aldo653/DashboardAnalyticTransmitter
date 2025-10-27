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

export default function CardtrendlistrikReg({ data }) {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedType, setSelectedType] = useState("EI");
  const [selectedRegion, setSelectedRegion] = useState("Prabumulih");

  const safeData = Array.isArray(data) ? data : [];

  // ✅ Ambil daftar unik "Satuan_Transmisi" dari data
  const regionOptions = useMemo(() => {
    const unique = new Set();
    safeData.forEach((row) => {
      const val = row["Satuan Transmisi Daerah"];
      if (val && val.trim() !== "") unique.add(val.trim());
    });
    const list = Array.from(unique).sort();
    if (list.includes("Prabumulih")) {
      return ["Prabumulih", ...list.filter((v) => v !== "Prabumulih")];
    }
    return list;
  }, [safeData]);

  // ✅ Proses data sesuai filter
  const chartData = useMemo(() => {
    const grouped = {};

    safeData.forEach((row) => {
      const daerah = row["Satuan Transmisi Daerah"];
      if (!daerah || daerah !== selectedRegion) return; // filter wilayah

      const tglRaw = row["Tanggal_Fix"];
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
      if (selectedType === "EI")
        keys = ["R-N (Volt) 1", "S-N (Volt) 1", "T-N (Volt) 1"];
      else if (selectedType === "EO")
        keys = ["R-N (Volt)", "S-N (Volt)", "T-N (Volt)"];

      keys.forEach((key) => {
        const rawVal = row[key];
        const value = Number(String(rawVal).replace(",", "."));
        grouped[dateKey][key] = isNaN(value) ? null : value;
      });
    });

    return Object.values(grouped)
      .sort((a, b) => a._dateObj - b._dateObj)
      .map(({ _dateObj, ...rest }) => rest);
  }, [safeData, selectedMonth, selectedType, selectedRegion]);

  const lineKeys =
    selectedType === "EI"
      ? ["R-N (Volt) 1", "S-N (Volt) 1", "T-N (Volt) 1"]
      : ["R-N (Volt)", "S-N (Volt)", "T-N (Volt)"];

  const colors = ["#539bff", "#28c76f", "#ff9f43"];

  const yDomain = selectedType === "EI" ? [200, 230] : [200, 230];

  return (
    <div className="col-12 col-md-6">
      <div className="card w-100" style={{ height: "460px" }}>
        <div className="card-body">
          {/* Judul */}
          <h6 className="fw-semibold mb-3 text-center">
            <i className="ti ti-bolt text-warning me-2 fw-bold"></i>
            Distribusi Penggunaan Listrik{" "}
            {selectedType === "EI"
              ? "Electrosys Input"
              : selectedType === "EO"
              ? "Electrosys Output"
              : selectedType === "NU"
              ? "NEC - U"
              : "NEC - V"}{" "}
            (KWatt) {selectedRegion}
          </h6>

          {/* ✅ Tambahkan filter wilayah (region) */}
          <div className="d-flex justify-content-center align-items-center mb-3 gap-2 flex-nowrap flex-wrap">
            <select
              className="form-select form-select-sm"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{ width: "180px" }}
            >
              {regionOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

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
            </select>

            <button
              className="btn btn-sm btn-outline-info"
              onClick={() => {
                setSelectedMonth("");
                setSelectedType("EI");
                setSelectedRegion("Prabumulih");
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
