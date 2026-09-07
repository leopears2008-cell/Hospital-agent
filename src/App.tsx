import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PatientApp from './PatientApp';
import AdminApp from './AdminApp';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<PatientApp />} />
      </Routes>
    </Router>
  );
}
