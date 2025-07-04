/**
 * DownloadButton.tsx
 * 
 * Simple reusable button that triggers download actions.
 * Accepts label text and an onClick handler.
 */

interface DownloadButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function DownloadButton({ label, onClick, disabled = false }: DownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
      type="button"
    >
      {label}
    </button>
  );
}
