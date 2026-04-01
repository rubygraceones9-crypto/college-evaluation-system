const fs = require('fs');
const path = require('path');

const filesToFix = [
  'app/dean/evaluation-setup/page.tsx',
  'components/EvaluationSetup/StepAcademicPeriod.tsx',
  'app/login/page.tsx',
  'app/student/history/page.tsx',
  'app/dean/settings/page.tsx',
  'app/dean/users/page.tsx',
  'app/dean/evaluations/page.tsx',
  'app/student/profile/page.tsx',
  'app/teacher/results/page.tsx',
  'components/layout/Sidebar.tsx'
];

for (const f of filesToFix) {
  const filePath = path.join(__dirname, f);
  if (!fs.existsSync(filePath)) continue;
  
  let c = fs.readFileSync(filePath, 'utf8');
  let original = c;

  // Safer label fix:
  // Find `<label className="block...">...Text...</label>`
  c = c.replace(/<label (className="block[^"]+">)(.*?)<\/label>/gs, '<div $1$2</div>');

  // Fix 2: Add role and onKeyDown to common div onClick issues
  c = c.replace(/<div([^>]*)onClick=\{([^}]+)\}([^>]*)>/g, (match, p1, p2, p3) => {
    if (match.includes('role=') || match.includes('onKeyDown')) return match;
    return `<div${p1}onClick={${p2}} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') { (${p2.replace('() =>', '').trim()})(); } }}${p3}>`;
  });

  if (c !== original) {
    fs.writeFileSync(filePath, c, 'utf8');
    console.log('Fixed:', filePath);
  }
}
