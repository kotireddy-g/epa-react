import { Home } from 'lucide-react';

interface FloatingHomeButtonProps {
  onClick: () => void;
}

export function FloatingHomeButton({ onClick }: FloatingHomeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
      title="Go to Idea page"
    >
      <Home className="w-6 h-6" />
    </button>
  );
}
