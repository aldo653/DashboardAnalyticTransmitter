// utils/dataHelpers.js
export function getMonthlyAverage(data, columnNames) {
    if (!data || data.length === 0) return 0;

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // pastikan columnNames bisa array atau string
    const cols = Array.isArray(columnNames) ? columnNames : [columnNames];

    // filter hanya data di bulan & tahun sekarang
    const filtered = data.filter((row) => {
        const [datePart] = row["Timestamp"].split(" ");
        const [day, month, year] = datePart.split("/").map(Number);
        return month === currentMonth && year === currentYear;
    });

    if (filtered.length === 0) return 0;

    // hitung rata-rata
    const sum = filtered.reduce((acc, row) => {
        // jumlahkan semua kolom yang dipilih
        const rowSum = cols.reduce((cAcc, col) => {
            return cAcc + (Number(row[col]) || 0);
        }, 0);

        return acc + rowSum;
    }, 0);

    const totalCount = filtered.length * cols.length;
    return (sum / totalCount).toFixed(2);
}
