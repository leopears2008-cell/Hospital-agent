const fs = require('fs');
let content = fs.readFileSync('src/components/UserAppointmentsModal.tsx', 'utf8');

const newFetch = `
  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (!response.ok) throw new Error("Failed to load appointments");
      const appts = await response.json();
      appts.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAppointments(appts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
`;

content = content.replace(/const fetchAppointments = async \(\) => \{[\s\S]*?\};\n/, newFetch);

fs.writeFileSync('src/components/UserAppointmentsModal.tsx', content);
