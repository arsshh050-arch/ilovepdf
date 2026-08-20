import fs from 'fs';
let content = fs.readFileSync('src/components/Header.tsx', 'utf8');
content = content.replace(/logoAltText \|\| 'iLovePDF'/g, "logoAltText || 'iLovePDF.in'");
content = content.replace(/alt="iLovePDF"/g, 'alt="iLovePDF.in"');
fs.writeFileSync('src/components/Header.tsx', content);
