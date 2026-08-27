const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

// Update imports if needed (we might want layout icon)
code = code.replace(
  `import { X, Activity, Thermometer, HeartPulse, Stethoscope, Phone, Save, TrendingUp, User as UserIcon, LogOut } from 'lucide-react';`,
  `import { X, Activity, Thermometer, HeartPulse, Stethoscope, Phone, Save, TrendingUp, User as UserIcon, LogOut, LayoutDashboard, Settings } from 'lucide-react';`
);

// Update props interface
code = code.replace(
  `  currentUser: User | null;
  onLogout: () => void;
}`,
  `  currentUser: User | null;
  onLogout: () => void;
  onNavigate?: (mode: string) => void;
}`
);

// Update component signature
code = code.replace(
  `export function SideMenu({ isOpen, onClose, currentUser, onLogout }: SideMenuProps) {`,
  `export function SideMenu({ isOpen, onClose, currentUser, onLogout, onNavigate }: SideMenuProps) {`
);

// Update the rendering of currentUser in the sidebar to include navigation links for their role
const targetCurrent = `{currentUser && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-rose-500 hover:bg-rose-100 rounded-full transition-colors flex items-center justify-center"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}`;

const replacementCurrent = `{currentUser && (
            <div className="space-y-2">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                    <p className="text-xs text-slate-500">{currentUser.email}</p>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-rose-500 hover:bg-rose-100 rounded-full transition-colors flex items-center justify-center"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
              
              {/* Role-based Navigation Links */}
              {(currentUser.role === 'admin' || currentUser.role === 'doctor') && (
                <div className="bg-slate-50 rounded border border-slate-200 p-2 space-y-1">
                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate('dashboard');
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-500" />
                    Patient Dashboard
                  </button>
                  
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        if (onNavigate) onNavigate('admin');
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
                    >
                      <Settings className="w-4 h-4 text-blue-600" />
                      Admin Panel
                    </button>
                  )}
                  
                  {currentUser.role === 'doctor' && (
                    <button
                      onClick={() => {
                        if (onNavigate) onNavigate('doctorDashboard');
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors"
                    >
                      <Stethoscope className="w-4 h-4 text-emerald-600" />
                      Doctor Portal
                    </button>
                  )}
                </div>
              )}
            </div>
          )}`;

code = code.replace(targetCurrent, replacementCurrent);

fs.writeFileSync('src/components/SideMenu.tsx', code);
