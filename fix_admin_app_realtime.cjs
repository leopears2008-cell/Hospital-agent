const fs = require('fs');

let content = fs.readFileSync('src/AdminApp.tsx', 'utf8');

const regex = /const unsubscribe = onSnapshot\([\s\S]*?return \(\) => \{ if \(unsubscribe\) unsubscribe\(\); \}\n\s*\}, \[authorized\]\);/;

const replacement = `const channel = supabase
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

content = content.replace(regex, replacement);
fs.writeFileSync('src/AdminApp.tsx', content);
