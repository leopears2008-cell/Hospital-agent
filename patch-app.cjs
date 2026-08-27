const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);`;
const replacement = `  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const handleAiAction = (action: any) => {
    if (!action) return;
    switch (action.type) {
      case 'find_doctors':
      case 'book_appointment':
        setViewMode('doctors');
        break;
      case 'find_hospitals':
        setViewMode('list');
        if (action.payload) {
          setFilters(prev => ({
            ...prev,
            district: action.payload.district || prev.district,
            specialty: action.payload.specialty || prev.specialty
          }));
        }
        break;
    }
  };`;

code = code.replace(target, replacement);

const target2 = `<AIChatbot />`;
const replacement2 = `<AIChatbot onAction={handleAiAction} />`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', code);
