"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactSpeedometer from "react-d3-speedometer";

export default function SpeedometerSwasta({ data }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("RTV");
  const [width, setWidth] = useState(340);
  const containerRef = useRef(null);

  // Responsif otomatis menyesuaikan lebar card
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newWidth = Math.min(containerWidth * 0.85, 420);
        setWidth(newWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const safeData = Array.isArray(data) ? data : [];

  // Set tanggal default ke data terakhir (hindari pergeseran zona waktu)
  useEffect(() => {
    if (safeData.length > 0 && !selectedDate) {
      const dates = safeData.map((row) => row?.Tgl).filter(Boolean).map((tgl) => {
        const [m, d, y] = tgl.split("/");
        return new Date(Number(y), Number(m) - 1, Number(d));
      }).filter((d) => !isNaN(d)).sort((a, b) => b - a);
      const latest = dates[0];
      if (latest) {
        const formatted = `${latest.getFullYear()}-${String(latest.getMonth() + 1).padStart(2, "0")}-${String(latest.getDate()).padStart(2, "0")}`;
        setSelectedDate(formatted);
      }
    }
  }, [safeData, selectedDate]);

  // Ambil nilai sesuai tanggal & channel
  const valueForDate = (() => {
    if (!selectedDate) return null;
    const found = safeData.find((row) => {
      const tglRaw = row["Tgl"];
      if (!tglRaw) return false;
      const [month, day, year] = tglRaw.split("/");
      const dateKey = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      return dateKey === selectedDate;
    });
    if (!found) return null;
    const val = Number(String(found[selectedChannel]).replace(",", "."));
    return isNaN(val) ? null : val;
  })();

  const target = ["PAL TV", "BTV"].includes(selectedChannel) ? 2 : 4;
  const value = valueForDate ?? 0;

  return (
    <div className="col-12 col-md-6">
      <div className="card w-100" style={{ height: "460px" }}>
        <div className="card-body d-flex flex-column justify-content-between h-100">
          {/* Header & Filter */}
          <div>
            <h6 className="fw-semibold mb-0 flex-grow-1 text-center mb-3">
              <i className="ti ti-gauge text-primary me-2 fw-bold"></i>Mbpsrate Channel Mitra (Mbps)
            </h6>
            <div className="d-flex justify-content-center align-items-center gap-2 flex-nowrap">
              <select className="form-select form-select-sm" value={selectedChannel} onChange={(e) => setSelectedChannel(e.target.value)} style={{ width: "130px" }}>
                <option value="RTV">RTV</option>
                <option value="BTV">BTV</option>
                <option value="RCTI">RCTI</option>
                <option value="MDTV">MDTV</option>
                <option value="PAL TV">PAL TV</option>
              </select>
              <input type="date" className="form-control form-control-sm" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ width: "140px" }} />
              <button className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center" style={{ width: "34px", height: "34px" }} onClick={() => setSelectedDate("")} title="Reset tanggal">
                <i className="ti ti-refresh"></i>
              </button>
            </div>
          </div>

          {/* Speedometer */}
          <div ref={containerRef} className="flex-grow-1 d-flex justify-content-center align-items-center">
            <ReactSpeedometer
              minValue={0}
              maxValue={target}
              value={value}
              segments={4}
              segmentColors={["#fa896b", "#ffae1f", "#13deb9", "#5d87ff"]}
              needleColor="black"
              ringWidth={50}
              currentValueText={`${value.toFixed(2)} Mbps`}
              textColor={value > target ? "red" : "#111"}
              valueTextFontSize="27px"
              needleTransitionDuration={1300}
              needleTransition="easeElastic"
              width={width}
              height={width * 0.65}
              fluidWidth={false}
            />
          </div>

          {/* Status indikator */}
          <div className="text-center">
            {valueForDate === null ? (
              <span className="text-muted">Pilih tanggal untuk melihat data</span>
            ) : value > target ? (
              <span className="badge bg-danger px-3 py-2">Melebihi Target ({target} Mbps)</span>
            ) : (
              <span className="badge bg-success px-3 py-2">Dalam Batas Normal</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
