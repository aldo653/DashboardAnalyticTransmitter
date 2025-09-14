"use client";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parse } from "date-fns";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function MainDashboard() {
    const [data, setData] = React.useState([]);
    const [selectedDate, setSelectedDate] = React.useState("");

    React.useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/main-transmiiter");
            const result = await res.json();
            if (result.data) setData(result.data);
        };

        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const filteredData = selectedDate
        ? data.filter((row) => {
            const rowDate = parse(
                row["Timestamp"].split(" ")[0],
                "dd/MM/yyyy",
                new Date()
            );
            return (
                rowDate.getFullYear() === selectedDate.getFullYear() &&
                rowDate.getMonth() === selectedDate.getMonth() &&
                rowDate.getDate() === selectedDate.getDate()
            );
        })
        : data;

    // Mapping data untuk chart
    const chartData = filteredData.map((row) => ({
        timestamp: row["Timestamp"].split(" ")[1] || row["Timestamp"], // ambil jam
        videoOutput: Number(row["Video Output (Kw)"]) || 0
    }));

    return (
        <div>
            <div className="row">
                {/* Card Tabel */}
                <div className="col-12 col-md-6">
                    <div className="card w-100" style={{height: "350px"}}>
                        <div className="card-body">
                            <div className="d-sm-flex d-block align-items-center justify-content-between mb-3">
                                <div className="mb-3 mb-sm-0">
                                    <h5 className="card-title fw-semibold">Nilai Transmisi</h5>
                                    <p className="card-subtitle mb-0">Overview of Profit</p>
                                </div>
                                <div>
                                    <DatePicker
                                        className="form-control"
                                        selected={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Klik untuk pilih tanggal"
                                    />
                                </div>
                            </div>
                            <div style={{ maxHeight: "230px", overflowY: "auto" }}>
                                <table className="table table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th>Tanggal</th>
                                            <th>Nilai</th>
                                            <th>Posisi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((row, index) => (
                                            <tr key={index}>
                                                <td>{row["Timestamp"]}</td>
                                                <td>{row["EXCITER TX DIGITAL"]}</td>
                                                <td>{row["Video Output (Kw)"]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Grafik */}
                <div className="col-12 col-md-6">
                    <div className="card w-100" style={{height: "350px"}}>
                        <div className="card-body">
                            <h6 className="fw-semibold mb-3">
                                Grafik Video Output
                            </h6>
                            <ResponsiveContainer width="110%" height={250} style={{ marginLeft: "-40px" }}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />

                                    <XAxis
                                        dataKey="timestamp"
                                        stroke="#ccc"
                                        tick={{ fontSize: 10, fill: '#666' }} // font X-axis kecil dan soft
                                    />

                                    <YAxis
                                        stroke="#ccc"
                                        tick={{ fontSize: 10, fill: '#666' }} // font Y-axis kecil dan soft
                                    />

                                    <Tooltip
                                        wrapperStyle={{ fontSize: '12px' }} // tooltip lebih kecil
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="videoOutput"
                                        stroke="#8884d8"
                                        strokeWidth={1.5}
                                        dot={{ r: 2 }}
                                        activeDot={{ r: 4 }}
                                        isAnimationActive={true}
                                        animationDuration={800}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
