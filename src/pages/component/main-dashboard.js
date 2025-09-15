"use client";
import React, { useState, useEffect } from "react";
import { useTransmitterData } from "../api/fetchController";
import CardTable from "./main/card1";
import CardChart from "./main/card2";

export default function DashboardLayout() {
    const { data, loading } = useTransmitterData();
    const [selectedDate, setSelectedDate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.NEXT_PUBLIC_CHAT_ID;

    console.log("TELEGRAM_BOT_TOKEN:", TELEGRAM_BOT_TOKEN);
    console.log("CHAT_ID:", CHAT_ID);

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
            <CardTable
                data={data}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />
            <div className="row">
                <CardChart data={data} />
            </div>
        </div>
    );
}
