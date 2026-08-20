import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminSimplePages.tsx', 'utf8');

// Find and remove the AdminLanguagesPage function
const start = content.indexOf('export function AdminLanguagesPage()');
if (start !== -1) {
  const end = content.indexOf('// 4. Schema Manager Page');
  content = content.substring(0, start) + content.substring(end);
  fs.writeFileSync('src/pages/admin/AdminSimplePages.tsx', content);
  console.log('Removed AdminLanguagesPage from AdminSimplePages.tsx');
}
