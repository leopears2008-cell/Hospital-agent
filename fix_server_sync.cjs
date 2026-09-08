const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const syncEndpoint = `
app.post("/api/auth/sync", async (req, res) => {
  try {
    const { uid, email, name } = req.body;
    if (!uid) {
      return res.status(400).json({ error: "UID is required" });
    }
    
    // getOrCreateUser handles creating the user in Firebase and returning the role
    const userData = await getOrCreateUser(uid, email, name);
    
    res.json({ success: true, user: userData, role: userData.role });
  } catch (error: any) {
    console.error("Auth sync error:", error);
    res.status(500).json({ success: false, error: "Failed to sync user" });
  }
});
`;

if (!content.includes("/api/auth/sync")) {
    content = content.replace('app.post("/api/chat"', syncEndpoint + '\napp.post("/api/chat"');
    fs.writeFileSync('server.ts', content);
}
