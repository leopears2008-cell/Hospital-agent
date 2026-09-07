const fs = require('fs');

let content = fs.readFileSync('src/AdminApp.tsx', 'utf8');

// replace imports
content = content.replace(/import \{ doc, getDoc, collection, addDoc, serverTimestamp, onSnapshot \} from 'firebase\/firestore';\n/, '');
content = content.replace(/import \{ db \} from '\.\/lib\/firebase';\n/, "import { supabase } from './lib/supabase';\n");

// replace useEffect for appointments
const oldUseEffect = `  useEffect(() => {
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

    return () => { if (unsubscribe) unsubscribe(); }
  }, [authorized]);`;

const newUseEffect = `  useEffect(() => {
    if (!authorized) return;
    
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'appointments' },
        (payload) => {
          const appt = payload.new;
          const id = appt.id;
          const message = \`New appointment requested by \${appt.patientName || 'a patient'}.\`;
          
          setToasts(prev => {
            if (prev.find(t => t.id === id)) return prev;
            return [{ id, message }, ...prev].slice(0, 5);
          });
          
          setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
          }, 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authorized]);`;

content = content.replace(oldUseEffect, newUseEffect);

fs.writeFileSync('src/AdminApp.tsx', content);
