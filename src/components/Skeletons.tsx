export function DoctorCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
      <div className="p-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-slate-200 mb-4" />
        <div className="h-6 w-3/4 bg-slate-200 rounded-lg mb-2" />
        <div className="h-4 w-1/2 bg-slate-200 rounded-lg mb-4" />
        
        <div className="flex gap-2 w-full justify-center mb-6">
          <div className="h-6 w-16 bg-slate-200 rounded-full" />
          <div className="h-6 w-16 bg-slate-200 rounded-full" />
        </div>
        
        <div className="w-full h-10 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

export function AppointmentTableSkeleton() {
  return (
    <div className="space-y-4 w-full">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-full" />
            <div className="space-y-2">
              <div className="h-5 w-32 bg-slate-200 rounded" />
              <div className="h-4 w-24 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="h-8 w-24 bg-slate-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}
