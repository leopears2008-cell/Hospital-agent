const fs = require('fs');
let content = fs.readFileSync('src/PatientApp.tsx', 'utf8');

const missingBlock = `      </>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar
        onOpenSideMenu={() => setIsSideMenuOpen(true)}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode as any}
        totalHospitals={allHospitals.length}
        currentUser={currentUser}
        onOpenAuth={() => {}}
        onLogout={handleLogout}
        onOpenAppointments={() => setIsAppointmentsModalOpen(true)}
      />
      <main className="flex-1 flex overflow-hidden relative bg-slate-100">
        {viewMode === 'dashboard' && currentUser?.role !== 'doctor' && (
          <Dashboard 
            hospitals={allHospitals} 
            onNavigate={(mode) => setViewMode(mode as any)} 
            currentUser={currentUser}
          />
        )}
        {viewMode === 'doctors' && (
          <DoctorDirectory
            currentUser={currentUser}
            onOpenAuth={() => {}}
          />
        )}`;

content = content.replace(/<LandingPage[\s\S]*?\/>\n\s*\{viewMode === 'doctorDashboard'/, 
  `<LandingPage onOpenAuth={() => {}} />\n` + missingBlock + `\n        {viewMode === 'doctorDashboard'`);

fs.writeFileSync('src/PatientApp.tsx', content);
