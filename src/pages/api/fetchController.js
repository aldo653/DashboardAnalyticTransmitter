// controllers/transmitterController.js
"use client";
import { useEffect, useState } from "react";

export function useTransmitterData(intervalMs = 10000) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/main-transmiiter");
                const result = await res.json();
                if (result.data) setData(result.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, intervalMs);
        return () => clearInterval(interval);
    }, [intervalMs]);

    return { data, loading };
}
