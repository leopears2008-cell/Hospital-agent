import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  onGoHome: () => void;
}

export function NotFound({ onGoHome }: NotFoundProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 max-w-lg w-full flex flex-col items-center">
        <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <AlertTriangle className="w-12 h-12" />
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Page Not Found</h2>
        
        <p className="text-slate-500 mb-8 max-w-sm">
          The page you are looking for doesn't exist, has been moved, or you don't have permission to access it.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <button 
            onClick={() => {
              window.history.pushState({}, '', '/');
              onGoHome();
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
