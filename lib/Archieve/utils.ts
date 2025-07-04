// lib/utils.ts

/**
 * Exports an array of objects as a CSV file download
 */
export function downloadCSV(data: any[], filename: string) {
  if (!data.length) return;

  const headers = Object.keys(data[0]).join(',');
  const rows = data
    .map((row) =>
      Object.values(row)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n');

  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
