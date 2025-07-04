import React from 'react';

type UploadHistoryItem = {
  id: string;
  filename: string;
  num_records: number;
  uploaded_at: string;
};

interface DashboardProps {
  history: UploadHistoryItem[];
  onSelectUpload: (uploadId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, onSelectUpload }) => {
  if (history.length === 0) {
    return <p className="text-center mt-8 text-gray-600">No upload history found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Upload History</h2>
      <table className="w-full border border-gray-300 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Filename</th>
            <th className="p-2 border">Records</th>
            <th className="p-2 border">Uploaded At</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr
              key={item.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectUpload(item.id)}
            >
              <td className="p-2 border">{item.filename}</td>
              <td className="p-2 border text-center">{item.num_records}</td>
              <td className="p-2 border text-center">{new Date(item.uploaded_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
