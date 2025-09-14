"use client";
import React from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function CardChart({ data }) {
    // kalau data undefined/null, jadikan array kosong
    const safeData = Array.isArray(data) ? data : [];

    const chartData = safeData.map((row) => {
        const timestamp = row["Timestamp"] ? row["Timestamp"].split(" ")[1] : "N/A";
        return {
            timestamp,
            videoOutput: Number(row["Video Output (Kw)"]) || 0
        };
    });

    return (
        <div className="col-12 col-md-6">
            <div className="card w-100" style={{ height: "350px" }}>
                <div className="card-body">
                    <h6 className="fw-semibold mb-3">Grafik Video Output</h6>
                    <ResponsiveContainer width="110%" height={250} style={{ marginLeft: "-40px" }}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis
                                dataKey="timestamp"
                                stroke="#ccc"
                                tick={{ fontSize: 10, fill: '#666' }}
                            />
                            <YAxis
                                stroke="#ccc"
                                tick={{ fontSize: 10, fill: '#666' }}
                            />
                            <Tooltip wrapperStyle={{ fontSize: '12px' }} />
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
    );
}
