"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTransmitterData } from "../api/fetchController";
import { sendTelegramMessage } from "@/utils/teleBot";
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
  const { data, loading } = useTransmitterData(10000);
  const [isLoading, setIsLoading] = useState(true);
  const lastSentTimestamp = useRef(null); // supaya kirim 1x per timestamp

  useEffect(() => {
  if (!data || data.length === 0) {
    console.log("🚫 Data kosong atau belum tersedia");
    return;
  }

  const lastRow = data[data.length - 1];
  const timestamp = lastRow["Timestamp"];
  console.log("🕒 Mengecek data terbaru:", timestamp);

  // Cegah pengiriman berulang untuk timestamp yang sama
  if (timestamp === lastSentTimestamp.current) {
    console.log("⏸ Notifikasi sudah dikirim untuk timestamp ini:", timestamp);
    return;
  }

  const channelThresholds = {
    "TVRI SUMSEL": 4,
    "TVRI NASIONAL": 4,
    "TVRI SPORT": 4,
    "TVRI WORLD": 4,
    "RCTI": 4,
    "RTV": 4,
    "MDTV": 4,
    "BTV": 2,
    "PAL TV": 2,
  };

  console.log("📊 Mulai pengecekan nilai channel...");
  const exceededChannels = Object.entries(channelThresholds)
    .filter(([channel, threshold]) => {
      const rawValue = lastRow[channel];
      const value = parseFloat(String(rawValue).replace(",", "."));
      console.log(
        `➡️ ${channel}: raw="${rawValue}", parsed=${value} Mbps (threshold ${threshold})`
      );
      return !isNaN(value) && value > threshold;
    })
    .map(([channel]) => channel);

  if (exceededChannels.length > 0) {
    console.log("⚠️ Channel melebihi ambang batas:", exceededChannels);

    const messageLines = exceededChannels.map((channel) => {
      const value = parseFloat(String(lastRow[channel]).replace(",", ".")).toFixed(2);
      return `📺 ${channel}: ${value} Mbps`;
    });

    const message =
      `⚠️ *Laporan Keadaan Output Transmisi Palembang* ⚠️\n\n` +
      `🗓 Tanggal: ${timestamp}\n` +
      `👤 Petugas: ${lastRow["Petugas"]}\n\n` +
      messageLines.join("\n") +
      `\n\n📈 Nilai di atas ambang batas normal.`;

    sendTelegramMessage(message);
    lastSentTimestamp.current = timestamp;
    console.log("🔔 Notifikasi dikirim untuk timestamp:", timestamp);
  } else {
    console.log("✅ Tidak ada channel yang melebihi ambang batas.");
  }
}, [data]);


  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "350px" }}
      >
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
