/**
 * ErrorMessage.tsx
 * 
 * Displays an error message with consistent styling.
 */

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return <p className="text-red-600 font-semibold my-2">{message}</p>;
}
