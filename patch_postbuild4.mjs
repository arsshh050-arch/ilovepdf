import fs from 'fs';

let content = fs.readFileSync('postbuild.mjs', 'utf8');

// Insert root route
content = content.replace(/const routes = \[/, 
  "const routes = [\n    { slug: '', title: 'Online PDF Tools for Everyday Document Tasks | iLovePDF.in', desc: 'Use browser-based tools to merge, split, compress, convert, edit and prepare PDF documents for everyday work.', h1: 'Online PDF Tools for Everyday Document Tasks' },");

fs.writeFileSync('postbuild.mjs', content);
