const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const replaceStr = `
(async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
  });
})();
`;

content = content.replace(/  if \(process\.env\.NODE_ENV !== "production"\) \{[\s\S]*?startServer\(\);/, replaceStr);
fs.writeFileSync('server.ts', content);
