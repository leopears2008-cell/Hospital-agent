const fs = require('fs');
let code = fs.readFileSync('src/components/UserAppointmentsModal.tsx', 'utf8');

const targetStr = `                      {app.status === 'cancelled' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                          <X className="w-3.5 h-3.5" /> Cancelled
                        </span>
                      )}`;
const replacementStr = `                      {app.status === 'cancelled' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                          <X className="w-3.5 h-3.5" /> Cancelled
                        </span>
                      )}
                      {app.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <X className="w-3.5 h-3.5" /> Rejected
                        </span>
                      )}`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/UserAppointmentsModal.tsx', code);
