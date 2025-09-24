import { fetchSpreadsheetData } from "@/pages/api/main-transmiiter";
import { sendTelegramMessage } from "./teleBot";

let lastSentTimestamp = null;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const sheetId = "1RSDgWrkO3aoURJeCQz6tDE0tuw78bXKtEf4WgFDKoS4";
    const range = "Form Responses 1!A:AH";
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    const formatted = await fetchSpreadsheetData(sheetId, range, apiKey);
    if (formatted.length === 0) {
      return res.status(200).json({ data: [] });
    }

    const lastRow = formatted[formatted.length - 1];
    const timestamp = lastRow["Timestamp"];
    const outputValue = parseFloat(lastRow["Video Output (Kw)"]);

    console.log("Last row timestamp:", timestamp, "Video Output:", outputValue);
    console.log("Last sent timestamp:", lastSentTimestamp);

    if (!isNaN(outputValue) && outputValue < 5 && timestamp !== lastSentTimestamp) {
      const message =
        `⚠️ *Laporan Keadaan Video Output Transmisi Palembang* ⚠️\n\n` +
        `🗓 Tanggal: ${timestamp}\n` +
        `👤 Petugas: ${lastRow["Petugas"]}\n\n` +
        `📹 Video Output: ${outputValue} Kw`;

      await sendTelegramMessage(message);

      lastSentTimestamp = timestamp;
      console.log("Notif terkirim dan state diupdate (memory)");
    } else {
      console.log("Tidak ada notif dikirim (video >=5 atau timestamp sama)");
    }

    res.status(200).json({ data: formatted });
  } catch (error) {
    console.error("Google Sheets API error:", error);
    res.status(500).json({ error: error.message });
  }
}
