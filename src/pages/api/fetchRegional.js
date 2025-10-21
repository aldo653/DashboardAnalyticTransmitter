"use client";
import { useEffect, useState } from "react";

export function useTransmitterRegional(intervalMs = 10000) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/regional-transmitter");
        const result = await res.json();
        if (result.formatted) {
          setData(result.formatted);
        } else {
          setData([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return { data, loading };
}
