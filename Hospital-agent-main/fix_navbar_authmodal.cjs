const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const oldAuthSection = `<Show when="signed-out">
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <button className="px-3 py-1.5 border border-slate-200 rounded text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer">
                    <LogIn className="w-3.5 h-3.5" /> Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold transition-colors flex items-center gap-1 shadow-xs cursor-pointer">
                    <UserPlus className="w-3.5 h-3.5" /> Sign up
                  </button>
                </SignUpButton>
              </div>
            </Show>`;

const newAuthSection = `<Show when="signed-out">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 border border-slate-200 rounded text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" /> Login
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Sign up
                </button>
              </div>
            </Show>`;

content = content.replace(oldAuthSection, newAuthSection);
fs.writeFileSync('src/components/Navbar.tsx', content);

