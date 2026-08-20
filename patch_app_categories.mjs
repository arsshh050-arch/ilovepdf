import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('path="/convert-pdf"')) {
    const newRoutes = `
                  <Route path="/convert-pdf" element={<AllPdfToolsPage />} />
                  <Route path="/organize-pdf-tools" element={<AllPdfToolsPage />} />
                  <Route path="/edit-pdf-tools" element={<AllPdfToolsPage />} />
                  <Route path="/pdf-security" element={<AllPdfToolsPage />} />
                  <Route path="/pdf-ai-tools" element={<AllPdfToolsPage />} />
`;
    content = content.replace(/<Route path="\/all-tools" [^\n]+\n/, match => match + newRoutes);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Patched App.tsx with category routes.");
} else {
    console.log("Category routes already exist.");
}
