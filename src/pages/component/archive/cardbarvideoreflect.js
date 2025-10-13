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

export default function CardChartBarReflected({ data }) {
  const [selectedYear, setSelectedYear] = useState("2025"); // default tahun
  const [viewMode, setViewMode] = useState("monthly"); // "monthly" | "weekly"
  const safeData = Array.isArray(data) ? data : [];

  const chartData = useMemo(() => {
    const grouped = {};

    safeData.forEach((row) => {
      const tglRaw = row["Tgl"];
      if (!tglRaw) return;

      // parsing format "MM/DD/YYYY"
      const parts = tglRaw.toString().split("/");
      if (parts.length < 3) return;

      const month = Number(parts[0]);
      const day = Number(parts[1]);
      const year = Number(parts[2]);
      if (!month || !year) return;

      // filter tahun
      if (String(year) !== selectedYear) return;

      const rawValue = row["Video Reflected (Watt)"];
      if (!rawValue) return;

      const value = Number(String(rawValue).replace(",", "."));
      if (isNaN(value)) return;

      // tentukan key grouping: bulanan / mingguan
      let key;
      if (viewMode === "monthly") {
        key = `${year}-${String(month).padStart(2, "0")}`;
      } else {
        const dateObj = new Date(year, month - 1, day);
        const weekNumber = Math.ceil((day + dateObj.getDay()) / 7);
        key = `${year}-${String(month).padStart(2, "0")}-W${weekNumber}`;
      }

      if (!grouped[key]) {
        grouped[key] = { total: 0, count: 0, month, year, key };
      }
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
  }, [safeData, selectedYear, viewMode]);

  return (
    <div className="col-12 col-md-6">
      <div className="card w-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-semibold mb-0">
              <i className="ti ti-video text-primary me-2 fw-bold"></i>
              {viewMode === "monthly"
                ? "Rata-Rata Video Reflected (Watt) Bulanan"
                : "Rata-Rata Video Reflected (Watt) Mingguan"}
            </h6>

            <div className="d-flex gap-2">
              {/* Filter Mode */}
              <select
                className="form-select form-select-sm"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
              >
                <option value="monthly">Bulanan</option>
                <option value="weekly">Mingguan</option>
              </select>

              {/* Filter Tahun */}
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

              {/* Reset */}
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => {
                  setSelectedYear("2025");
                  setViewMode("monthly");
                }}
                title="Reset filter"
              >
                <i className="ti ti-refresh"></i>
              </button>
            </div>
          </div>

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
                formatter={(v) => [`${v} Kw`, "Rata-rata"]}
              />
              <Bar
                dataKey="value"
                fill="#d57d35ff"
                barSize={40}
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
