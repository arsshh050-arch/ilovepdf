import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add the lazy imports if missing
if (!content.includes('GenericTool')) {
    const imports = `
const GenericTool = lazy(() => import('./tools/GenericTool').then(m => ({ default: m.GenericTool })));
`;
    content = content.replace(/const AllPdfToolsPage = lazy[^\n]+\n/, match => match + imports);
}

// Add the routes
if (!content.includes('path="/pdf-to-word"')) {
    const newRoutes = `
                  <Route path="/pdf-to-word" element={<GenericTool />} />
                  <Route path="/pdf-to-jpg" element={<GenericTool />} />
                  <Route path="/jpg-to-pdf" element={<GenericTool />} />
`;
    content = content.replace(/<Route path="\/unlock-pdf" [^\n]+\n/, match => match + newRoutes);
}

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx with missing tool routes.");
