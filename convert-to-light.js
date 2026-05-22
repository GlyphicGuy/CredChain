const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace dark mode specific classes with semantic or light mode ones
    let newContent = content
      .replace(/text-white/g, 'text-foreground')
      .replace(/text-gray-400/g, 'text-muted-foreground')
      .replace(/text-gray-300/g, 'text-muted-foreground')
      .replace(/text-gray-200/g, 'text-foreground')
      .replace(/bg-black\/50/g, 'bg-secondary/50')
      .replace(/bg-black\/40/g, 'bg-secondary/40')
      .replace(/bg-black/g, 'bg-background')
      .replace(/bg-zinc-950/g, 'bg-background')
      .replace(/border-white\/5/g, 'border-border/40')
      .replace(/border-white\/10/g, 'border-border/60')
      .replace(/border-white\/20/g, 'border-border')
      .replace(/border-white\/30/g, 'border-border')
      .replace(/bg-white\/5/g, 'bg-secondary/50')
      .replace(/bg-white\/10/g, 'bg-secondary')
      .replace(/bg-white\/20/g, 'bg-secondary')
      .replace(/hover:bg-white\/5/g, 'hover:bg-secondary/60')
      .replace(/hover:bg-white\/10/g, 'hover:bg-secondary')
      .replace(/hover:text-white/g, 'hover:text-foreground')
      .replace(/text-white\/10/g, 'text-muted/50');
      
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
    }
  }
});
console.log('Conversion complete.');
