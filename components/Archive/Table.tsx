/**
 * Purpose:
 * - Reusable Table component to display tabular data.
 * - Accepts column definitions and row data.
 * - Makes tables consistent and customizable.
 * 
 * Usage:
 * <Table
 *    columns={[{ header: 'Name', key: 'name' }, ...]}
 *    data={[{ name: 'Alice', age: 30 }, ...]}
 * />
 */

import React from 'react';

type Column<T> = {
  header: string;
  key: keyof T;
  // Optional custom cell render function
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

export default function Table<T extends Record<string, any>>({ columns, data }: TableProps<T>) {
  return (
    <table
      style={{
        borderCollapse: 'collapse',
        width: '100%',
        marginTop: 20,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <thead>
        <tr>
          {columns.map(({ header }, i) => (
            <th
              key={i}
              style={{
                border: '1px solid #ccc',
                padding: '8px 12px',
                backgroundColor: '#f4f4f4',
                textAlign: 'left',
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ padding: 20, textAlign: 'center' }}>
              No data available.
            </td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr
              key={idx}
              style={{
                backgroundColor: idx % 2 === 0 ? 'white' : '#fafafa',
              }}
            >
              {columns.map(({ key, render }, colIdx) => (
                <td key={colIdx} style={{ border: '1px solid #ccc', padding: '8px 12px' }}>
                  {render ? render(row) : String(row[key])}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
