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
  const lastSentTimestamp = useRef(null);
  const lastReminderDate = useRef("");

  // Ambil data terakhir yang dikirim dari localStorage
  useEffect(() => {
    const savedTimestamp = localStorage.getItem("lastSentTimestamp");
    if (savedTimestamp) lastSentTimestamp.current = savedTimestamp;

    const savedReminder = localStorage.getItem("lastReminderDate");
    if (savedReminder) lastReminderDate.current = savedReminder;
  }, []);

  // === LOGIKA 1: Notifikasi berdasarkan threshold ===
  useEffect(() => {
    if (!data || data.length === 0) return;

    const lastRow = data[data.length - 1];
    const timestamp = lastRow["Timestamp"];
    if (timestamp === lastSentTimestamp.current) return;

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

    const exceededChannels = Object.entries(channelThresholds)
      .filter(([channel, threshold]) => {
        const rawValue = lastRow[channel];
        const value = parseFloat(String(rawValue).replace(",", "."));
        return !isNaN(value) && value > threshold;
      })
      .map(([channel]) => channel);

    if (exceededChannels.length > 0) {
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
      localStorage.setItem("lastSentTimestamp", timestamp);
    }
  }, [data]);

  // === LOGIKA 2: Pengingat harian (jam 04:00, 09:00, 15:00, 20:00 WIB) ===
  useEffect(() => {
    // Bisa berisi "HH:00" atau "HH:MM"
    const reminderTimes = ["04:00", "09:00", "15:00", "20:00"];

    const checkReminder = () => {
      const now = new Date();

      // Ambil jam & menit secara andal tanpa bergantung ke separator lokal
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(now);

      const hourPart = parts.find((p) => p.type === "hour");
      const minutePart = parts.find((p) => p.type === "minute");
      const hour = hourPart ? hourPart.value.padStart(2, "0") : "00";
      const minute = minutePart ? minutePart.value.padStart(2, "0") : "00";
      const currentHM = `${hour}:${minute}`; // mis. "15:04"

      // Hari (YYYY-MM-DD) berdasarkan WIB
      const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(now);
      // Reminder key akan menyertakan menit agar ambang spesifik menit tidak tercampur
      const reminderKey = `${today}-${currentHM}`;

      // Normalisasi reminderTimes supaya seragam (titik -> dua titik, dsb.)
      const normalizedReminders = reminderTimes.map((t) => t.replace(".", ":"));

      console.log(
        `⏱️ WIB sekarang: ${currentHM} | lastReminderDate: ${lastReminderDate.current} | normalizedReminders: ${normalizedReminders.join(
          ", "
        )}`
      );

      // Cek 2 kondisi:
      // 1) Ada reminder yang persis cocok pada HH:MM (mis. "15:04")
      // 2) Ada reminder hanya jam (dengan :00) yang cocok pada jam sekarang (mis. "09:00" ketika menit 00)
      const isExactMatch = normalizedReminders.includes(currentHM);
      const isHourMatch = normalizedReminders.includes(`${hour}:00`) && minute === "00";

      if (isExactMatch || isHourMatch) {
        // Untuk hour-match kita gunakan key dengan :00 agar tidak bentrok
        const keyToUse = isExactMatch ? reminderKey : `${today}-${hour}:00`;

        if (lastReminderDate.current !== keyToUse) {
          console.log(`🔔 Waktu cocok (${isExactMatch ? currentHM : hour + ":00"}) → kirim notifikasi`);

          const message =
            `⏰ *Pengingat Metering Harian (WIB)*\n\n` +
            `🗓 Waktu: ${currentHM} WIB\n` +
            `Mohon lakukan pengecekan & pencatatan metering harian di Stasiun Transmisi Palembang.\n\n` +
            `#TVRI #Monitoring #TransmisiPalembang`;

          sendTelegramMessage(message);
          lastReminderDate.current = keyToUse;
          localStorage.setItem("lastReminderDate", keyToUse);
          console.log("✅ Notifikasi pengingat dikirim:", message);
        } else {
          console.log(`⚠️ Sudah dikirim untuk ${isExactMatch ? currentHM : hour + ":00"} hari ini.`);
        }
      } else {
        console.log(`🕐 Bukan waktu pengingat (sekarang ${currentHM})`);
      }
    };

    // Jalankan sekali saat mount supaya langsung terlihat di log
    checkReminder();

    const interval = setInterval(checkReminder, 60000); // cek tiap 1 menit
    return () => clearInterval(interval);
  }, []);


  // === Loading state ===
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
