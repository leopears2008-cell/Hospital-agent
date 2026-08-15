const AdmZip = require('adm-zip');
const fs = require('fs');

async function createZip() {
  const zip = new AdmZip();
  const excludeDirs = ['node_modules', 'dist', '.git'];
  
  function addDir(dirPath, zipPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      if (excludeDirs.includes(file) && dirPath === '.') continue;
      
      const fullPath = dirPath === '.' ? file : `${dirPath}/${file}`;
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        addDir(fullPath, `${zipPath}${file}/`);
      } else {
        zip.addLocalFile(fullPath, zipPath);
      }
    }
  }
  
  addDir('.', '');
  zip.writeZip('hospital-ai-agent.zip');
  console.log('Zip file created successfully!');
}

createZip().catch(console.error);
