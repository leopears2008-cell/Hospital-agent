const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Replace Clerk components with manual buttons
const oldHeroButtons = `<SignUpButton mode="modal">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 rounded-lg font-bold text-lg transition-colors cursor-pointer">
              Sign In
            </button>
          </SignInButton>`;

const newHeroButtons = `<button
            onClick={() => onOpenAuth('signup')}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onOpenAuth('login')}
            className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 rounded-lg font-bold text-lg transition-colors cursor-pointer"
          >
            Sign In
          </button>`;

content = content.replace(oldHeroButtons, newHeroButtons);

const oldNavbarButtons = `<SignInButton mode="modal">
            <button className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-lg font-bold text-sm transition-colors cursor-pointer">
              Sign In
            </button>
          </SignInButton>`;

const newNavbarButtons = `<button
            onClick={() => onOpenAuth('login')}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-lg font-bold text-sm transition-colors cursor-pointer"
          >
            Sign In
          </button>`;
          
content = content.replace(oldNavbarButtons, newNavbarButtons);

fs.writeFileSync('src/components/LandingPage.tsx', content);

