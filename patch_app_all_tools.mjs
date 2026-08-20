import fs from 'fs';

// 1. Read all tools from pdfTools.ts
const pdfToolsContent = fs.readFileSync('src/config/pdfTools.ts', 'utf8');
const slugRegex = /slug:\s*['"]\/([^'"]+)['"]/g;
const allToolSlugs = [];
let match;
while ((match = slugRegex.exec(pdfToolsContent)) !== null) {
  // Filter out the ones already hardcoded
  if (!['merge-pdf', 'split-pdf', 'compress-pdf', 'protect-pdf', 'unlock-pdf', 'pdf-to-word', 'pdf-to-jpg', 'jpg-to-pdf'].includes(match[1])) {
    allToolSlugs.push(match[1]);
  }
}

// 2. Generate Route tags
let newRoutes = '';
allToolSlugs.forEach(slug => {
  newRoutes += `                  <Route path="/${slug}" element={<GenericTool />} />\n`;
});

// 3. Patch App.tsx
let content = fs.readFileSync('src/App.tsx', 'utf8');
if (!content.includes('path="/sign-pdf"')) {
    content = content.replace(/<Route path="\/jpg-to-pdf" [^\n]+\n/, match => match + newRoutes);
    fs.writeFileSync('src/App.tsx', content);
    console.log(`Patched App.tsx with ${allToolSlugs.length} missing tool routes.`);
} else {
    console.log("Tool routes already exist in App.tsx");
}
