const fs = require('fs');
const path = require('path');

const directory = './';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') {
        walkDir(dirPath, callback);
      }
    } else {
      callback(path.join(dir, f));
    }
  });
}

const replacements = [
  { regex: /\bparseInt\(/g, replacement: 'Number.parseInt(' },
  { regex: /\bparseFloat\(/g, replacement: 'Number.parseFloat(' },
  { regex: /\bisNaN\(/g, replacement: 'Number.isNaN(' },
  { regex: /\bArray\(/g, replacement: 'new Array(' }
];

walkDir(directory, function(filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Some manual fixes for the conditional leaking values
    if (filePath.endsWith('Sidebar.tsx')) {
      content = content.replace('{isOpen && (', '{Boolean(isOpen) && (');
    }
    if (filePath.endsWith('DashboardCard.tsx')) {
      content = content.replace('{trend && (', '{Boolean(trend) && (');
    }

    for (const r of replacements) {
      content = content.replace(r.regex, r.replacement);
    }
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed:', filePath);
    }
  }
  
  if (filePath.endsWith('.sh')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    content = content.replace(/if \[ /g, "if [[ ");
    content = content.replace(/ \]/g, " ]]");
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed shell:', filePath);
    }
  }
});
