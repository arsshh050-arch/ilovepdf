import fs from 'fs';
let toolPage = fs.readFileSync('src/tools/UniversalToolPage.tsx', 'utf8');
toolPage = toolPage.replace(/label: 'PDF Tools', path: '\/'/, "label: 'PDF Tools', path: '/pdf-tools'");
fs.writeFileSync('src/tools/UniversalToolPage.tsx', toolPage);

let seoSection = fs.readFileSync('src/components/seo/ToolSeoSection.tsx', 'utf8');
seoSection = seoSection.replace(/name: 'PDF Tools', path: '\/'/, "name: 'PDF Tools', path: '/pdf-tools'");
fs.writeFileSync('src/components/seo/ToolSeoSection.tsx', seoSection);
