import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

// The production fallback block:
// app.get('*', (req, res) => {
//   if (req.path.includes('.')) {
//     return res.status(404).send('File not found');
//   }
//   res.sendFile(path.join(distPath, 'index.html'));
// });

const newFallback = `    app.get('*', (req, res) => {
      if (req.path.includes('.')) {
        return res.status(404).send('File not found');
      }
      
      const p = req.path;
      // Client-only routes that should return 200 OK
      const isValidClientRoute = p.startsWith('/admin') || 
                                 p === '/login' || 
                                 p === '/signup' || 
                                 p === '/forgot-password' || 
                                 p.includes('/result/');
      
      if (isValidClientRoute) {
        res.sendFile(path.join(distPath, 'index.html'));
      } else {
        // Unrecognized route, return proper 404 HTTP status
        res.status(404).sendFile(path.join(distPath, '404.html'));
      }
    });`;

content = content.replace(/app\.get\('\*', \(req, res\) => \{\s+if \(req\.path\.includes\('\.'\)\) \{\s+return res\.status\(404\)\.send\('File not found'\);\s+\}\s+res\.sendFile\(path\.join\(distPath, 'index\.html'\)\);\s+\}\);/g, newFallback);

fs.writeFileSync('server.ts', content);
console.log("Patched server.ts SPA fallback.");
