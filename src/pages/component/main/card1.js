"use client";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parse } from "date-fns";

export default function CardTable({ data, selectedDate, setSelectedDate }) {
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

    return (
        <div className="col-12">
            <div className="card w-100" style={{ height: "350px" }}>
                <div className="card-body">
                    <div className="d-sm-flex d-block align-items-center justify-content-between mb-3">
                        <div className="mb-3 mb-sm-0">
                            <h6 className="fw-semibold">Metering of Transmitter</h6>
                            <p className="mb-0">TVRI Sumatera Selatan</p>
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
                    <div style={{ maxHeight: "230px", overflowY: "auto", overflowX: "auto" }}>
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Tanggal - Waktu</th>
                                    <th>Jenis</th>
                                    <th>Tipe Exciter</th>
                                    <th>Video Output (Kw)</th>
                                    <th>Video Reflected (Watt)</th>
                                    <th>Exciter Output (dBm)</th>
                                    <th>Cooling Liquid Flow (L/min)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row["Timestamp"]}</td>
                                        <td>{row["TX DIGITAL"]}</td>
                                        <td>{row["EXCITER TX DIGITAL"]}</td>
                                        <td>{row["Video Output (Kw)"]}</td>
                                        <td>{row["Video Reflected (Watt)"]}</td>
                                        <td>{row["Exciter Output (dBm)"]}</td>
                                        <td>{row["Cooling Liquid Flow (L/min)"]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
