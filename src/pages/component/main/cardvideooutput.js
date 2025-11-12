"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function CardChart({ data }) {
  // state untuk menyimpan bulan dan kolom yang dipilih
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("Video Output (Kw)");

  useEffect(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    setSelectedMonth(currentMonth);
  }, []);

  // pastikan data berbentuk array agar aman
  const safeData = Array.isArray(data) ? data : [];

  // olah data untuk menghitung nilai rata-rata per tanggal
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
      const dateKey = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
      if (!grouped[dateKey]) grouped[dateKey] = { total: 0, count: 0, dateObj: new Date(year, month - 1, day) };
      grouped[dateKey].total += value;
      grouped[dateKey].count += 1;
    });
    return Object.entries(grouped)
      .map(([date, { total, count, dateObj }]) => ({
        tanggal: date,
        nilaiRata: count > 0 ? Number((total / count).toFixed(2)) : 0,
        _dateObj: dateObj
      }))
      .sort((a, b) => a._dateObj - b._dateObj)
      .map(({ _dateObj, ...rest }) => rest);
  }, [safeData, selectedMonth, selectedColumn]);

  // opsi kolom yang bisa dipilih untuk grafik
  const columnOptions = ["Video Output (Kw)", "Video Reflected (Watt)", "Video IM (dB)", "Video MER (dB)"];

  return (
    <div className="col-12 col-md-6">
      <div className="card w-100" style={{ height: "440px" }}>
        <div className="card-body">
          {/* Judul grafik */}
          <div><h6 className="fw-semibold mb-3 text-center"><i className="ti ti-video text-danger me-2 fw-bold"></i>Rata-Rata {selectedColumn}</h6></div>

          {/* Filter bulan dan kolom */}
          <div className="d-flex justify-content-center align-items-center mb-3 gap-2 flex-nowrap">
            <input type="month" className="form-control form-control-sm" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{ width: "150px" }} />
            <select className="form-select form-select-sm" value={selectedColumn} onChange={(e) => setSelectedColumn(e.target.value)} style={{ width: "180px" }}>{columnOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}</select>
            <button className="btn btn-sm btn-outline-danger" onClick={() => { setSelectedMonth(""); setSelectedColumn("Video Output (Kw)"); }} title="Reset filter" style={{ whiteSpace: "nowrap" }}><i className="ti ti-refresh"></i></button>
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
              <XAxis dataKey="tanggal" stroke="#ccc" tick={{ fontSize: 10, fill: "#666" }} angle={-30} textAnchor="end" height={60} />
              <YAxis stroke="#ccc" tick={{ fontSize: 10, fill: "#666" }} />
              <Tooltip wrapperStyle={{ fontSize: "12px" }} />
              <Area type="monotone" dataKey="nilaiRata" stroke="#fa896b" strokeWidth={1.5} fill="url(#colorArea)" activeDot={{ r: 4, fill: "#fa896b", stroke: "#fff", strokeWidth: 1 }} dot={{ r: 2, fill: "#fa896b" }} isAnimationActive={true} animationDuration={800} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
