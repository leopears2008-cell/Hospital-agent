const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

if (!code.includes("import { db } from '../lib/firebase';")) {
  code = code.replace(
    "import { Appointment, Hospital } from '../types';",
    "import { Appointment, Hospital } from '../types';\nimport { db } from '../lib/firebase';\nimport { collection, onSnapshot } from 'firebase/firestore';"
  );
}

const targetStats = `  // Mock data for charts if DB is empty
  const [stats, setStats] = useState({
    totalUsers: 1245,
    totalAppointments: 384,
    activeHospitals: hospitals.length,
    revenue: 45000
  });`;

const replacementStats = `  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    activeHospitals: hospitals.length,
    revenue: 0
  });

  useEffect(() => {
    // Real-time listener for users
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setStats(prev => ({ ...prev, totalUsers: snapshot.size }));
    });

    // Real-time listener for appointments
    const unsubscribeAppointments = onSnapshot(collection(db, 'appointments'), (snapshot) => {
      setStats(prev => ({ ...prev, totalAppointments: snapshot.size }));
    });

    return () => {
      unsubscribeUsers();
      unsubscribeAppointments();
    };
  }, []);`;

code = code.replace(targetStats, replacementStats);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
