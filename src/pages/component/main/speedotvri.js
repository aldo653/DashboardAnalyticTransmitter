"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactSpeedometer from "react-d3-speedometer";

export default function SpeedometerTvri({ data }) {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedChannel, setSelectedChannel] = useState("TVRI SUMSEL"); // default
    const [width, setWidth] = useState(340);
    const containerRef = useRef(null);

    // Responsif otomatis
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

    // Ambil nilai berdasarkan tanggal & channel terpilih
    const valueForDate = (() => {
        if (!selectedDate) return null;
        const found = safeData.find((row) => {
            const tglRaw = row["Tgl"];
            if (!tglRaw) return false;
            const [month, day, year] = tglRaw.toString().split("/");
            const dateKey = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
            return dateKey === selectedDate;
        });
        if (!found) return null;
        const val = Number(String(found[selectedChannel]).replace(",", "."));
        return isNaN(val) ? null : val;
    })();

    const target = 4;
    const value = valueForDate ?? 0;

    return (
        <div className="col-12 col-md-6">
            <div className="card w-100" style={{ height: "460px" }}>
                <div className="card-body d-flex flex-column justify-content-between h-100">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center flex-wrap" style={{ gap: "0.75rem" }}>
                        {/* Judul */}
                        <h6 className="fw-semibold mb-0 flex-grow-1">
                            <i className="ti ti-gauge text-primary me-2 fw-bold"></i>
                            Bitrate Channel TVRI (Bit)
                        </h6>

                        {/* Filter */}
                        <div className="d-flex align-items-center gap-2 flex-nowrap">
                            {/* Filter Channel */}
                            <select
                                className="form-select form-select-sm"
                                value={selectedChannel}
                                onChange={(e) => setSelectedChannel(e.target.value)}
                            >
                                <option value="TVRI SUMSEL">TVRI SUMSEL</option>
                                <option value="TVRI NASIONAL">TVRI NASIONAL</option>
                                <option value="TVRI WORLD">TVRI WORLD</option>
                                <option value="TVRI SPORT">TVRI SPORT</option>
                            </select>

                            {/* Filter Tanggal */}
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />

                            {/* Tombol Reset */}
                            <button
                                className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center"
                                style={{ width: "34px", height: "34px" }}
                                onClick={() => setSelectedDate("")}
                                title="Reset tanggal"
                            >
                                <i className="ti ti-refresh"></i>
                            </button>
                        </div>
                    </div>

                    {/* Gauge */}
                    <div
                        ref={containerRef}
                        className="flex-grow-1 d-flex justify-content-center align-items-center"
                    >
                        <ReactSpeedometer
                            minValue={0}
                            maxValue={target}
                            value={value}
                            segments={4}
                            segmentColors={["#fa896b", "#ffae1f", "#13deb9", "#5d87ff"]} // danger, warning, success, primary
                            needleColor="black"
                            ringWidth={50}
                            currentValueText={`${value.toFixed(2)} dB`}
                            textColor={value > target ? "red" : "#111"}
                            valueTextFontSize="27px"
                            needleTransitionDuration={1300}
                            needleTransition="easeElastic"
                            width={width}
                            height={width * 0.65}
                            fluidWidth={false}
                        />
                    </div>

                    {/* Status */}
                    <div className="text-center">
                        {valueForDate === null ? (
                            <span className="text-muted">Pilih tanggal untuk melihat data</span>
                        ) : value > target ? (
                            <span className="badge bg-danger px-3 py-2">
                                Melebihi Target (4 dB)
                            </span>
                        ) : (
                            <span className="badge bg-success px-3 py-2">
                                Dalam Batas Normal
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
