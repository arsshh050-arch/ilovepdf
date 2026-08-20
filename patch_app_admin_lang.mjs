import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "const AdminLanguagesPage = lazy(() => import('./pages/admin/AdminSimplePages').then(m => ({ default: m.AdminLanguagesPage })));",
  "const AdminLanguagesPage = lazy(() => import('./pages/admin/AdminLanguagesPage').then(m => ({ default: m.AdminLanguagesPage })));"
);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched App.tsx to load new AdminLanguagesPage');
