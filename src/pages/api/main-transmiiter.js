// const TELEGRAM_BOT_TOKEN = "8277366890:AAFUkOAPwb8vLVwtlD2fnIX_sucwMbSIU0g";
// const CHAT_ID = "7975926963";

// async function sendTelegramMessage(message) {
//     const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
//     await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             chat_id: CHAT_ID,
//             text: message,
//             parse_mode: "Markdown",
//         }),
//     });
// }

// export default async function handler(req, res) {
//     if (req.method === "GET") {
//         try {
//             const sheetId = "1RSDgWrkO3aoURJeCQz6tDE0tuw78bXKtEf4WgFDKoS4";
//             const range = "Form Responses 1!A:AH";
//             const apiKey = "AIzaSyDxb2VIw8ShxMFOIf7WXTS20uIxFVdNt14";
//             const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
//             const response = await fetch(url);
//             const data = await response.json();

//             if (!data.values || data.values.length <= 1) {
//                 return res.status(200).json({ data: [] });
//             }

//             const [header, ...rows] = data.values;
//             const formatted = rows.map((row) =>
//                 header.reduce((obj, key, index) => {
//                     if (row[index] !== undefined && row[index] !== "") {
//                         obj[key] = row[index];
//                     }
//                     return obj;
//                 }, {})
//             );

//             // Ambil baris terakhir
//             const lastRow = rows[rows.length - 1];
//             const rowData = header.reduce((obj, key, index) => {
//                 obj[key] = lastRow[index] || "";
//                 return obj;
//             }, {});

//             // Cek Video Output < 5
//             const outputValue = parseFloat(rowData["Video Output (Kw)"]);
//             if (!isNaN(outputValue) && outputValue < 5) {
//                 const message = `⚠️ *Laporan Keadaan Video Output Transmisi Palembang* ⚠️\n\n` +
//                                 `🗓 Tanggal: ${rowData["Timestamp"]}\n` +
//                                 `👤 Petugas: ${rowData["Petugas"]}\n\n` +
//                                 `📹 Video Output: ${rowData["Video Output (Kw)"]} Kw`;

//                 await sendTelegramMessage(message);
//             }

//             res.status(200).json({ data: formatted });
//         } catch (error) {
//             console.error("Google Sheets API error:", error);
//             res.status(500).json({ error: error.message });
//         }
//     } else {
//         res.setHeader("Allow", ["GET"]);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }

import fs from "fs";
import path from "path";

const TELEGRAM_BOT_TOKEN = "8277366890:AAFUkOAPwb8vLVwtlD2fnIX_sucwMbSIU0g";
const CHAT_ID = "7975926963";
const STATE_FILE = path.join(process.cwd(), "lastSent.json"); // file untuk simpan timestamp terakhir

async function sendTelegramMessage(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "Markdown",
        }),
    });
}

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const sheetId = "1RSDgWrkO3aoURJeCQz6tDE0tuw78bXKtEf4WgFDKoS4";
        const range = "Form Responses 1!A:AH";
        const apiKey = "AIzaSyDxb2VIw8ShxMFOIf7WXTS20uIxFVdNt14";
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.values || data.values.length <= 1) {
            return res.status(200).json({ data: [] });
        }

        const [header, ...rows] = data.values;
        const formatted = rows.map((row) =>
            header.reduce((obj, key, index) => {
                if (row[index] !== undefined && row[index] !== "") {
                    obj[key] = row[index];
                }
                return obj;
            }, {})
        );

        // Ambil baris terakhir
        const lastRow = rows[rows.length - 1];
        const rowData = header.reduce((obj, key, index) => {
            obj[key] = (lastRow[index] || "").toString().trim();
            return obj;
        }, {});

        // Baca timestamp terakhir dari file
        let lastSentTimestamp = null;
        if (fs.existsSync(STATE_FILE)) {
            const stateRaw = fs.readFileSync(STATE_FILE, "utf8");
            lastSentTimestamp = JSON.parse(stateRaw)?.lastTimestamp || null;
        }

        const timestamp = rowData["Timestamp"]; // gunakan Timestamp sebagai unik
        const outputValue = parseFloat(rowData["Video Output (Kw)"]);

        console.log("Last row timestamp:", timestamp, "Video Output:", outputValue);
        console.log("Last sent timestamp:", lastSentTimestamp);

        // Cek Video Output < 5 dan belum dikirim untuk timestamp ini
        if (!isNaN(outputValue) && outputValue < 5 && timestamp !== lastSentTimestamp) {
            const message = `⚠️ *Laporan Keadaan Video Output Transmisi Palembang* ⚠️\n\n` +
                `🗓 Tanggal: ${timestamp}\n` +
                `👤 Petugas: ${rowData["Petugas"]}\n\n` +
                `📹 Video Output: ${outputValue} Kw`;

            await sendTelegramMessage(message);

            // Simpan timestamp terakhir agar tidak dikirim lagi
            fs.writeFileSync(STATE_FILE, JSON.stringify({ lastTimestamp: timestamp }));
            console.log("Notif terkirim dan state diupdate");
        } else {
            console.log("Tidak ada notif dikirim (video >=5 atau timestamp sama)");
        }

        res.status(200).json({ data: formatted });
    } catch (error) {
        console.error("Google Sheets API error:", error);
        res.status(500).json({ error: error.message });
    }
}
