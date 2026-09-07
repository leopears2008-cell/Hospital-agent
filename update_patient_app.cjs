const fs = require('fs');

let content = fs.readFileSync('src/PatientApp.tsx', 'utf8');

// replace imports
content = content.replace(/import \{ doc, getDoc, setDoc, updateDoc, onSnapshot \} from 'firebase\/firestore';\n/, '');
content = content.replace(/import \{ db \} from '\.\/lib\/firebase';\n/, "import { supabase } from './lib/supabase';\n");

// replace useEffect for settings
const oldUseEffect = `  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'features'), (doc) => {
      if (doc.exists()) {
        setFeatures(doc.data() as any);
      }
    });
    return () => unsub();
  }, []);`;

const newUseEffect = `  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'features')
        .single();
      if (data) {
        // Exclude the id field if we just want features
        const { id, ...featureData } = data;
        setFeatures(featureData as any);
      }
    };
    fetchSettings();

    const channel = supabase
      .channel('settings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'settings', filter: 'id=eq.features' },
        (payload) => {
          const { id, ...featureData } = payload.new;
          setFeatures(featureData as any);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);`;

content = content.replace(oldUseEffect, newUseEffect);

fs.writeFileSync('src/PatientApp.tsx', content);
