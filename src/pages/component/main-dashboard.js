"use client";
import React, { useState, useEffect } from "react";
import { useTransmitterData } from "../api/fetchController";
import CardChart from "./main/cardvideooutput";
import CardReflect from "./main/cardvideoreflected";
import CardIm from "./main/cardvideoim";
import CarMer from "./main/cardvideoMer";
import CardCooling from "./main/cardcooling";
import CardCooolingLiquid from "./main/cardcoolingliquid";
import SpeedometerTvri from "./main/speedotvri";
import SpeedometerSwasta from "./main/speedoswasta";

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
                <CardReflect data={data} />
                <CardIm data={data} />
                <CarMer data={data} />
                <CardCooling data={data} />
                <CardCooolingLiquid data={data} />
                <SpeedometerTvri data={data} />
                <SpeedometerSwasta data={data} />
            </div>
        </div>
    );
}
