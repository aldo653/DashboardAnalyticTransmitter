// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { useTransmitterData } from "../api/fetchController";
// import { sendTelegramMessage } from "@/utils/teleBot";
// import CardChart from "./main/cardvideooutput";
// import SpeedometerTvri from "./main/speedotvri";
// import SpeedometerSwasta from "./main/speedoswasta";
// import CardChartBar from "./main/cardbarvideooutput";
// import CardChartCooling from "./main/cardcooling";
// import CardChartBarCool from "./main/cardbarcooling";
// import CardChartchanneltvri from "./main/cardchannel";
// import CardChartchannelswasta from "./main/cardswasta";
// import Cardtrendlistrik from "./main/cardtrendlistrik";
// import Cardtrendlistrikall from "./main/cardtrendalllistrik";
// import HeatmapTvri from "./main/heatmap";

// export default function DashboardLayout() {
//   const { data, loading } = useTransmitterData(10000);
//   const [isLoading, setIsLoading] = useState(true);
//   const lastSentTimestamp = useRef(null); // supaya kirim 1x per timestamp

//   useEffect(() => {
//   if (!data || data.length === 0) {
//     console.log("🚫 Data kosong atau belum tersedia");
//     return;
//   }

//   const lastRow = data[data.length - 1];
//   const timestamp = lastRow["Timestamp"];
//   console.log("🕒 Mengecek data terbaru:", timestamp);

//   // Cegah pengiriman berulang untuk timestamp yang sama
//   if (timestamp === lastSentTimestamp.current) {
//     console.log("⏸ Notifikasi sudah dikirim untuk timestamp ini:", timestamp);
//     return;
//   }

//   const channelThresholds = {
//     "TVRI SUMSEL": 4,
//     "TVRI NASIONAL": 4,
//     "TVRI SPORT": 4,
//     "TVRI WORLD": 4,
//     "RCTI": 4,
//     "RTV": 4,
//     "MDTV": 4,
//     "BTV": 2,
//     "PAL TV": 2,
//   };

//   console.log("📊 Mulai pengecekan nilai channel...");
//   const exceededChannels = Object.entries(channelThresholds)
//     .filter(([channel, threshold]) => {
//       const rawValue = lastRow[channel];
//       const value = parseFloat(String(rawValue).replace(",", "."));
//       console.log(
//         `➡️ ${channel}: raw="${rawValue}", parsed=${value} Mbps (threshold ${threshold})`
//       );
//       return !isNaN(value) && value > threshold;
//     })
//     .map(([channel]) => channel);

//   if (exceededChannels.length > 0) {
//     console.log("⚠️ Channel melebihi ambang batas:", exceededChannels);

//     const messageLines = exceededChannels.map((channel) => {
//       const value = parseFloat(String(lastRow[channel]).replace(",", ".")).toFixed(2);
//       return `📺 ${channel}: ${value} Mbps`;
//     });

//     const message =
//       `⚠️ *Laporan Keadaan Output Transmisi Palembang* ⚠️\n\n` +
//       `🗓 Tanggal: ${timestamp}\n` +
//       `👤 Petugas: ${lastRow["Petugas"]}\n\n` +
//       messageLines.join("\n") +
//       `\n\n📈 Nilai di atas ambang batas normal.`;

//     sendTelegramMessage(message);
//     lastSentTimestamp.current = timestamp;
//     console.log("🔔 Notifikasi dikirim untuk timestamp:", timestamp);
//   } else {
//     console.log("✅ Tidak ada channel yang melebihi ambang batas.");
//   }
// }, [data]);


//   useEffect(() => {
//     if (!loading) {
//       const timer = setTimeout(() => setIsLoading(false), 500);
//       return () => clearTimeout(timer);
//     }
//   }, [loading]);

//   if (isLoading) {
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ height: "350px" }}
//       >
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="row">
//         <CardChart data={data} />
//         <CardChartBar data={data} />
//         <CardChartCooling data={data} />
//         <CardChartBarCool data={data} />
//         <SpeedometerTvri data={data} />
//         <SpeedometerSwasta data={data} />
//         <CardChartchanneltvri data={data} />
//         <CardChartchannelswasta data={data} />
//         <Cardtrendlistrik data={data} />
//         <Cardtrendlistrikall data={data} />
//       </div>
//       <div className="col-12">
//         <HeatmapTvri data={data} />
//       </div>
//     </div>
//   );
// }

// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { useTransmitterData } from "../api/fetchController";
// import { sendTelegramMessage } from "@/utils/teleBot";
// import CardChart from "./main/cardvideooutput";
// import SpeedometerTvri from "./main/speedotvri";
// import SpeedometerSwasta from "./main/speedoswasta";
// import CardChartBar from "./main/cardbarvideooutput";
// import CardChartCooling from "./main/cardcooling";
// import CardChartBarCool from "./main/cardbarcooling";
// import CardChartchanneltvri from "./main/cardchannel";
// import CardChartchannelswasta from "./main/cardswasta";
// import Cardtrendlistrik from "./main/cardtrendlistrik";
// import Cardtrendlistrikall from "./main/cardtrendalllistrik";
// import HeatmapTvri from "./main/heatmap";

// export default function DashboardLayout() {
//   const { data, loading } = useTransmitterData(10000);
//   const [isLoading, setIsLoading] = useState(true);
//   const lastSentTimestamp = useRef(null);

//   // Ambil data terakhir yang dikirim dari localStorage (persisten antar refresh/tab)
//   useEffect(() => {
//     const savedTimestamp = localStorage.getItem("lastSentTimestamp");
//     if (savedTimestamp) {
//       lastSentTimestamp.current = savedTimestamp;
//       console.log("🧩 Restore lastSentTimestamp dari localStorage:", savedTimestamp);
//     }
//   }, []);

//   useEffect(() => {
//     if (!data || data.length === 0) {
//       console.log("🚫 Data kosong atau belum tersedia");
//       return;
//     }

//     const lastRow = data[data.length - 1];
//     const timestamp = lastRow["Timestamp"];
//     console.log("🕒 Mengecek data terbaru:", timestamp);

//     // Cegah pengiriman berulang untuk timestamp yang sama
//     if (timestamp === lastSentTimestamp.current) {
//       console.log("⏸ Notifikasi sudah dikirim untuk timestamp ini:", timestamp);
//       return;
//     }

//     const channelThresholds = {
//       "TVRI SUMSEL": 4,
//       "TVRI NASIONAL": 4,
//       "TVRI SPORT": 4,
//       "TVRI WORLD": 4,
//       "RCTI": 4,
//       "RTV": 4,
//       "MDTV": 4,
//       "BTV": 2,
//       "PAL TV": 2,
//     };

//     console.log("📊 Mulai pengecekan nilai channel...");
//     const exceededChannels = Object.entries(channelThresholds)
//       .filter(([channel, threshold]) => {
//         const rawValue = lastRow[channel];
//         const value = parseFloat(String(rawValue).replace(",", "."));
//         console.log(
//           `➡️ ${channel}: raw="${rawValue}", parsed=${value} Mbps (threshold ${threshold})`
//         );
//         return !isNaN(value) && value > threshold;
//       })
//       .map(([channel]) => channel);

//     if (exceededChannels.length > 0) {
//       console.log("⚠️ Channel melebihi ambang batas:", exceededChannels);

//       const messageLines = exceededChannels.map((channel) => {
//         const value = parseFloat(String(lastRow[channel]).replace(",", ".")).toFixed(2);
//         return `📺 ${channel}: ${value} Mbps`;
//       });

//       const message =
//         `⚠️ *Laporan Keadaan Output Transmisi Palembang* ⚠️\n\n` +
//         `🗓 Tanggal: ${timestamp}\n` +
//         `👤 Petugas: ${lastRow["Petugas"]}\n\n` +
//         messageLines.join("\n") +
//         `\n\n📈 Nilai di atas ambang batas normal.`;

//       sendTelegramMessage(message);
//       lastSentTimestamp.current = timestamp;
//       localStorage.setItem("lastSentTimestamp", timestamp); // simpan agar tidak kirim lagi walau refresh
//       console.log("🔔 Notifikasi dikirim untuk timestamp:", timestamp);
//     } else {
//       console.log("✅ Tidak ada channel yang melebihi ambang batas.");
//     }
//   }, [data]);

//   useEffect(() => {
//     if (!loading) {
//       const timer = setTimeout(() => setIsLoading(false), 500);
//       return () => clearTimeout(timer);
//     }
//   }, [loading]);

//   if (isLoading) {
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ height: "350px" }}
//       >
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="row">
//         <CardChart data={data} />
//         <CardChartBar data={data} />
//         <CardChartCooling data={data} />
//         <CardChartBarCool data={data} />
//         <SpeedometerTvri data={data} />
//         <SpeedometerSwasta data={data} />
//         <CardChartchanneltvri data={data} />
//         <CardChartchannelswasta data={data} />
//         <Cardtrendlistrik data={data} />
//         <Cardtrendlistrikall data={data} />
//       </div>
//       <div className="col-12">
//         <HeatmapTvri data={data} />
//       </div>
//     </div>
//   );
// }

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
    const reminderTimes = ["04:00", "10.00", "15:00", "20:00"];

    const checkReminder = () => {
      // Ambil waktu sekarang dalam zona waktu WIB (Asia/Jakarta)
      const nowUtc = new Date();
      const wibTime = new Date(nowUtc.getTime() + 7 * 60 * 60 * 1000); // UTC+7 (WIB)
      
      const currentHour = wibTime.getUTCHours().toString().padStart(2, "0");
      const currentMinute = wibTime.getUTCMinutes().toString().padStart(2, "0");
      const currentTime = `${currentHour}:${currentMinute}`;
      const today = wibTime.toISOString().split("T")[0];

      // Kirim notif jika jam cocok & belum dikirim hari ini pada jam itu
      if (
        reminderTimes.includes(`${currentHour}:00`) &&
        lastReminderDate.current !== `${today}-${currentHour}`
      ) {
        const message =
          `⏰ *Pengingat Metering Harian (WIB)*\n\n` +
          `🗓 Waktu: ${currentTime} WIB\n` +
          `Mohon lakukan pengecekan & pencatatan metering harian di Stasiun Transmisi Palembang.\n\n` +
          `#TVRI #Monitoring #TransmisiPalembang`;

        sendTelegramMessage(message);
        lastReminderDate.current = `${today}-${currentHour}`;
        localStorage.setItem("lastReminderDate", `${today}-${currentHour}`);
        console.log("🕘 Notifikasi pengingat dikirim (WIB):", message);
      }
    };

    const interval = setInterval(checkReminder, 60000); // cek tiap menit
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
