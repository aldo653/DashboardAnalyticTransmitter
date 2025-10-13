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
  ReferenceLine,
} from "recharts";

export default function CardChartchannelswasta({ data }) {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("RTV");

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

      const rawValue = row[selectedColumn];
      if (!rawValue) return;
      const value = Number(String(rawValue).replace(",", "."));
      if (isNaN(value)) return;

      const dateKey = `${String(day).padStart(2, "0")}/${String(month).padStart(
        2,
        "0"
      )}/${year}`;
      if (!grouped[dateKey])
        grouped[dateKey] = { total: 0, count: 0, dateObj: new Date(year, month - 1, day) };
      grouped[dateKey].total += value;
      grouped[dateKey].count += 1;
    });

    return Object.entries(grouped)
      .map(([date, { total, count, dateObj }]) => ({
        tanggal: date,
        nilaiRata: count > 0 ? Number((total / count).toFixed(2)) : 0,
        _dateObj: dateObj,
      }))
      .sort((a, b) => a._dateObj - b._dateObj)
      .map(({ _dateObj, ...rest }) => rest);
  }, [safeData, selectedMonth, selectedColumn]);

  const columnOptions = ["RTV", "RCTI", "MDTV", "BTV", "PAL TV"];

  // Tentukan batas dan domain Y dinamis
  const isLowRange = ["BTV", "PAL TV"].includes(selectedColumn);
  const yDomain = isLowRange ? [1.5, 2.5] : [3.2, 4.5];
  const batas = isLowRange ? 2 : 4;

  return (
    <div className="col-12 col-md-6">
      <div className="card w-100" style={{ height: "440px" }}>
        <div className="card-body">
          {/* Judul */}
          <h6 className="fw-semibold mb-3 text-center">
            <i className="ti ti-video text-info me-2 fw-bold"></i>
            Rata-Rata Bitrate {selectedColumn}
          </h6>

          {/* Filter */}
          <div className="d-flex justify-content-center align-items-center mb-3 gap-2 flex-nowrap">
            <div className="d-flex align-items-center gap-2">
              <input
                type="month"
                className="form-control form-control-sm"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ width: "150px" }}
              />
              <select
                className="form-select form-select-sm"
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                style={{ width: "180px" }}
              >
                {columnOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => {
                  setSelectedMonth("");
                  setSelectedColumn("RTV");
                }}
                title="Reset filter"
              >
                <i className="ti ti-refresh"></i>
              </button>
            </div>
          </div>

          {/* Grafik Line */}
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
                domain={yDomain}
                stroke="#ccc"
                tick={{ fontSize: 10, fill: "#666" }}
              />
              <Tooltip wrapperStyle={{ fontSize: "12px" }} />

              {/* Garis batas dinamis */}
              <ReferenceLine
                y={batas}
                stroke="red"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: `Batas ${batas}`,
                  position: "right",
                  fill: "red",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              />

              {/* Line Chart utama */}
              <Line
                type="monotone"
                dataKey="nilaiRata"
                stroke="#539bff"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  const warna = payload.nilaiRata > batas ? "red" : "#539bff";
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      stroke={warna}
                      strokeWidth={2}
                      fill={warna}
                    />
                  );
                }}
                activeDot={{ r: 5, fill: "#fff", stroke: "#539bff", strokeWidth: 2 }}
                isAnimationActive={true}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
