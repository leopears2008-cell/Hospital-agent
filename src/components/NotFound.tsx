import { AlertCircle, Home } from 'lucide-react';

interface NotFoundProps {
  onReturnHome: () => void;
}

export function NotFound({ onReturnHome }: NotFoundProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg max-w-md w-full text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Page Not Found</h2>
        <p className="text-slate-600 mb-8">
          The page or link you are trying to access doesn't exist or has been moved.
        </p>
        <button
          onClick={onReturnHome}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
