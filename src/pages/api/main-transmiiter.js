// src/pages/api/main-transmiiter.js

async function fetchSpreadsheetData() {
  try {
    // hardcode variabel
    const sheetId = "1RSDgWrkO3aoURJeCQz6tDE0tuw78bXKtEf4WgFDKoS4";
    const range = "Form Responses 1!A:AQ";
    const apiKey = "AIzaSyDxb2VIw8ShxMFOIf7WXTS20uIxFVdNt14";

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.values || data.values.length <= 1) {
      return { header: [], rows: [], formatted: [] };
    }

    const [header, ...rows] = data.values;

    return {
      header,
      rows,
      formatted: rows.map((row) =>
        header.reduce((obj, key, index) => {
          if (row[index] !== undefined && row[index] !== "") {
            obj[key] = row[index];
          }
          return obj;
        }, {})
      ),
    };
  } catch (error) {
    console.error("fetchSpreadsheetData error:", error.message);
    return { header: [], rows: [], formatted: [] };
  }
}

// ✅ API Route handler
export default async function handler(req, res) {
  try {
    const result = await fetchSpreadsheetData();
    res.status(200).json(result);
  } catch (error) {
    console.error("API handler error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
