const fs = require('fs');
let code = fs.readFileSync('src/AdminApp.tsx', 'utf8');

// Update firestore imports
code = code.replace(
  "import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';",
  "import { doc, getDoc, collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';"
);

// Update lucide imports
code = code.replace(
  "} from 'lucide-react';",
  ", Bell, X } from 'lucide-react';"
);

// Add state for toasts
code = code.replace(
  "const [authorized, setAuthorized] = useState(false);",
  "const [authorized, setAuthorized] = useState(false);\n  const [toasts, setToasts] = useState<{id: string, message: string}[]>([]);"
);

// Add useEffect for listening to appointments
const authEffect = `  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {`;

const appointmentEffect = `  useEffect(() => {
    if (!authorized) return;
    let initialLoad = true;
    
    const unsubscribe = onSnapshot(collection(db, 'appointments'), (snapshot) => {
      if (initialLoad) {
        initialLoad = false;
        return;
      }
      
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const appt = change.doc.data();
          const id = change.doc.id;
          const message = \`New appointment requested by \${appt.patientName || 'a patient'}.\`;
          
          setToasts(prev => {
            if (prev.find(t => t.id === id)) return prev;
            return [{ id, message }, ...prev].slice(0, 5);
          });
          
          setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
          }, 5000);
        }
      });
    });
    
    return () => unsubscribe();
  }, [authorized]);\n\n`;

code = code.replace(authEffect, appointmentEffect + authEffect);

// Add toasts JSX
const mainClosingTag = `        </main>
      </div>
    </div>`;

const toastsJsx = `        </main>
        
        {/* Toast Notifications */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          {toasts.map(toast => (
            <div key={toast.id} className="bg-white border border-slate-200 shadow-xl rounded-xl p-4 flex items-start gap-4 min-w-[300px] animate-in slide-in-from-right-8 duration-300">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-0.5">
                <h4 className="text-sm font-bold text-slate-800">New Request</h4>
                <p className="text-sm text-slate-600 mt-1">{toast.message}</p>
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>`;

code = code.replace(mainClosingTag, toastsJsx);

fs.writeFileSync('src/AdminApp.tsx', code);
