export function getMonthlyAverage(formatted, columnNames) {
  if (!formatted || formatted.length === 0) return 0;

  // pastikan kolom bisa string atau array
  const cols = Array.isArray(columnNames) ? columnNames : [columnNames];

  const sum = formatted.reduce((acc, row) => {
    const rowSum = cols.reduce((cAcc, col) => {
      let val = row[col];

      // ubah "5,02" jadi "5.02"
      if (typeof val === "string") {
        val = val.replace(",", ".");
      }

      const num = Number(val);
      return cAcc + (!isNaN(num) ? num : 0);
    }, 0);

    return acc + rowSum;
  }, 0);

  const totalCount = formatted.length * cols.length;
  return totalCount > 0 ? Number((sum / totalCount).toFixed(2)) : 0;
}
