export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const sheetId = "1wdYuEKGmXIO8iA7DBtG8gUKYzufd_f01MrM7hLJnVUo";
      const range = "Sheet1!A:C";
      const apiKey = "AIzaSyDxb2VIw8ShxMFOIf7WXTS20uIxFVdNt14";

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.values || data.values.length === 0) {
        return res.status(200).json({ data: [] });
      }

      const [header, ...rows] = data.values;
      const formatted = rows.map((row) =>
        header.reduce((obj, key, index) => {
          obj[key] = row[index] || "";
          return obj;
        }, {})
      );

      res.status(200).json({ data: formatted });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
