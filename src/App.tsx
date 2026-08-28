import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PatientApp from './PatientApp';
import AdminApp from './AdminApp';
import AdminLogin from './components/AdminLogin';
import PatientLogin from './components/PatientLogin';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/*" element={<PatientApp />} />
      </Routes>
    </Router>
  );
}
