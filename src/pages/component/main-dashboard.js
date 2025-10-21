"use client";
import React, { useState, useEffect } from "react";
import { useTransmitterData } from "../api/fetchController";
import CardChart from "./main/cardvideooutput";
import SpeedometerTvri from "./main/speedotvri";
import SpeedometerSwasta from "./main/speedoswasta";
import CardChartBar from "./main/cardbarvideooutput";
import CardChartCooling from "./main/cardcooling";
import CardChartBarCool from "./main/cardbarcooling";
import CardChartchanneltvri from "./main/cardchannel";
import CardChartchannelswasta from "./main/cardswasta";
import Cardtrendlistrik from "./main/cardtrendlistrik";
import Cardtrendlistrikall from "./main/cardtrendalllistrik";
import HeatmapTvri from "./main/heatmap";

export default function DashboardLayout() {
    const { data, loading } = useTransmitterData();
    const [selectedDate, setSelectedDate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => setIsLoading(false), 500);
            return () => clearTimeout(timer);
        }
    }, [loading]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "350px" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="row">
                <CardChart data={data} />
                <CardChartBar data={data} />
                <CardChartCooling data={data} />
                <CardChartBarCool data={data} />
                <SpeedometerTvri data={data} />
                <SpeedometerSwasta data={data} />
                <CardChartchanneltvri data={data} />
                <CardChartchannelswasta data={data} />
                <Cardtrendlistrik data={data} />
                <Cardtrendlistrikall data={data} />
            </div>
            <div className="col-12">
                <HeatmapTvri data={data} />
            </div>
        </div>
    );
}
