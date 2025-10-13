"use client";
import React, { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function CardCooolingLiquid({ data }) {
  const [selectedMonth, setSelectedMonth] = useState(""); 
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

      // build monthKey untuk filter
      const monthKey = `${year}-${String(month).padStart(2, "0")}`;
      if (selectedMonth && monthKey !== selectedMonth) return; // filter by month

      const rawValue = row["Cooling Liquid Flow (L/min)"];
      if (!rawValue) return;

      const value = Number(String(rawValue).replace(",", "."));
      if (isNaN(value)) return;

      // key tanggal
      const dateKey = `${String(day).padStart(2, "0")}/${String(
        month
      ).padStart(2, "0")}/${year}`;

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          total: 0,
          count: 0,
          dateObj: new Date(year, month - 1, day)
        };
      }
      grouped[dateKey].total += value;
      grouped[dateKey].count += 1;
    });

    return Object.entries(grouped)
      .map(([date, { total, count, dateObj }]) => ({
        tanggal: date,
        CoolingLiquid: count > 0 ? Number((total / count).toFixed(2)) : 0,
        _dateObj: dateObj
      }))
      .sort((a, b) => a._dateObj - b._dateObj)
      .map(({ _dateObj, ...rest }) => rest);
  }, [safeData, selectedMonth]);

  return (
    <div className="col-12 col-md-6">
      <div className="card w-100" style={{ height: "420px" }}>
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <div>
              <h6 className="fw-semibold mb-3"><i className="ti ti-droplet text-danger me-2 fw-bold"></i>Rata-Rata Cooling Liquid Flow (L/min)</h6>
            </div>
            <div className="d-flex gap-2 align-items-center mb-3">
              <input
                type="month"
                className="form-control form-control-sm"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
              <button className="btn btn-sm btn-outline-danger" onClick={() => setSelectedMonth("")}
                title="Tampilkan semua"><i className="ti ti-refresh"></i>
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCoolingLiquid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d57d35ff" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#d57d35ff" stopOpacity={0} />
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
                dataKey="CoolingLiquid"
                stroke="#d57d35ff"
                strokeWidth={1.5}
                fill="url(#colorCoolingLiquid)"
                activeDot={{
                  r: 4,
                  fill: "#d57d35ff",
                  stroke: "#fff",
                  strokeWidth: 1
                }}
                dot={{ r: 2, fill: "#d57d35ff" }}
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
