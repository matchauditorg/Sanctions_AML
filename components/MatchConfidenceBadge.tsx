/**
 * MatchConfidenceBadge.tsx
 * 
 * Displays a colored badge based on match confidence or risk level.
 * Used to visually emphasize the AI probability of screening hits.
 */

interface MatchConfidenceBadgeProps {
  confidence: number; // 0 to 100
}

export default function MatchConfidenceBadge({ confidence }: MatchConfidenceBadgeProps) {
  let colorClass = 'bg-green-100 text-green-800';
  if (confidence > 75) colorClass = 'bg-red-100 text-red-800';
  else if (confidence > 50) colorClass = 'bg-yellow-100 text-yellow-800';

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${colorClass}`}
      title={`Match confidence: ${confidence.toFixed(1)}%`}
    >
      {confidence.toFixed(1)}%
    </span>
  );
}
