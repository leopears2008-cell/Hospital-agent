import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PatientApp from './PatientApp';
import AdminApp from './AdminApp';
import OrganizationDashboard from './OrganizationDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/org/*" element={<OrganizationDashboard />} />
        <Route path="/*" element={<PatientApp />} />
      </Routes>
    </Router>
  );
}
