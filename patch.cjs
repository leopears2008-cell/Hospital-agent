const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `export default function App() {`;
const replacement = `export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);
`;

code = code.replace(target, replacement);

const targetReturn = `  if (loadingAuth) {`;
const replacementReturn = `  if (currentPath !== '/') {
    return (
      <NotFound onReturnHome={() => {
        window.history.pushState({}, '', '/');
        setCurrentPath('/');
      }} />
    );
  }

  if (loadingAuth) {`;

code = code.replace(targetReturn, replacementReturn);

fs.writeFileSync('src/App.tsx', code);
