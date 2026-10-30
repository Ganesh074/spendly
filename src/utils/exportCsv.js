// Escapes a value so commas, new lines, and quotes remain valid CSV data.
const csvValue = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`

// Builds and downloads the currently visible transactions as a CSV file.
export function exportToCSV(rows, month) {
  const headers = ['Date', 'Type', 'Category', 'Payment Method', 'Note', 'Amount']
  const lines = rows.map((row) => [row.date, row.type, row.category, row.paymentMethod || 'UPI', row.note, row.amount].map(csvValue).join(','))
  const blob = new Blob([[headers.map(csvValue).join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `spendly-transactions-${month}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
