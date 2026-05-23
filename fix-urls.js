const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('http://localhost:3002')) {
    content = content.replace(/['"`]http:\/\/localhost:3002([^'"`]*)['"`]/g, '`http://${typeof window !== "undefined" ? window.location.hostname : "localhost"}:3002$1`');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
});
