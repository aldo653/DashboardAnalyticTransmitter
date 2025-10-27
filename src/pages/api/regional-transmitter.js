// src/pages/api/main-transmitter.js

async function fetchSheetRegional() {
  try {
    // Hardcode variabel
    const sheetId = "172n10PQCuVpP2om-a4HJwmbntl2Kot1t46LSVUa0Rck";
    const range = "Form Responses 1!A:AF";
    const apiKey = "AIzaSyDxb2VIw8ShxMFOIf7WXTS20uIxFVdNt14";

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.values || data.values.length <= 1) {
      return { header: [], rows: [], formatted: [] };
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

    return { header, rows, formatted };
  } catch (error) {
    console.error("fetchSheetRegional error:", error.message);
    return { header: [], rows: [], formatted: [] };
  }
}

export default async function handler(req, res) {
  try {
    const result = await fetchSheetRegional();
    res.status(200).json(result);
  } catch (error) {
    console.error("API handler error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
