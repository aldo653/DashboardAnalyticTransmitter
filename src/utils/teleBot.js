// lib/teleBot.js
const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
const CHAT_IDS = process.env.NEXT_PUBLIC_CHAT_ID; 
// Bisa 1 atau banyak chat_id, misal: "123456789,987654321"

export async function sendTelegramMessage(message) {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const chatIdList = CHAT_IDS.split(",").map((id) => id.trim());

    for (const chatId of chatIdList) {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      });

      if (!res.ok) {
        console.error(`❌ Gagal kirim ke chat_id ${chatId}:`, res.statusText);
      } else {
        console.log(`✅ Notifikasi terkirim ke chat_id ${chatId}`);
      }
    }
  } catch (error) {
    console.error("❌ Gagal kirim notifikasi Telegram:", error);
  }
}
