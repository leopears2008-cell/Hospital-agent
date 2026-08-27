const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const targetRender = `{upcomingAppointment && (
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-1 shadow-lg">`;

const replacementRender = `{loadingAppt ? (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-pulse">
                <div className="h-6 w-1/3 bg-slate-200 rounded mb-6" />
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
                    <div className="h-5 w-48 bg-slate-200 rounded mb-6" />
                    <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
                    <div className="h-5 w-32 bg-slate-200 rounded" />
                  </div>
                  <div>
                    <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
                    <div className="h-5 w-48 bg-slate-200 rounded mb-6" />
                    <div className="h-10 w-full bg-slate-200 rounded-xl mt-6" />
                  </div>
                </div>
              </div>
            ) : upcomingAppointment && (
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-1 shadow-lg">`;

code = code.replace(targetRender, replacementRender);

const statusTarget = `<span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">Confirmed</span>`;
const statusReplacement = `<span className={\`bg-white/20 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider \${upcomingAppointment.status === 'pending' ? 'text-amber-200' : 'text-white'}\`}>{upcomingAppointment.status}</span>`;
code = code.replace(statusTarget, statusReplacement);

fs.writeFileSync('src/components/Dashboard.tsx', code);
