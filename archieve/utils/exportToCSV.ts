/**
 * Purpose:
 * This utility function exports an array of objects (like your screening results)
 * into a downloadable CSV file. It automatically generates CSV headers from object keys,
 * properly escapes quotes, and triggers a browser download of the CSV.
 */

export function exportToCSV(data: any[], filename = 'screening_results.csv') {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Extract CSV headers from the first object keys
  const headers = Object.keys(data[0]);

  // Convert each object into a CSV row, escaping double quotes as needed
  const csvRows = [
    headers.join(','), // CSV header row
    ...data.map(row =>
      headers
        .map(field => `"${String(row[field]).replace(/"/g, '""')}"`) // Escape quotes and wrap in quotes
        .join(',')
    ),
  ];

  // Join all rows with newline characters to create full CSV content
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create a temporary download link and trigger the download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
