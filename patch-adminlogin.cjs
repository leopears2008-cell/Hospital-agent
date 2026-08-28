const fs = require('fs');
let code = fs.readFileSync('src/components/AdminLogin.tsx', 'utf8');

const linkHtml = `          </form>
          
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <a 
              href="/" 
              className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
              &larr; Back to Patient Portal
            </a>
          </div>
        </div>`;

code = code.replace("          </form>\n        </div>", linkHtml);
fs.writeFileSync('src/components/AdminLogin.tsx', code);
