import fs from 'fs';

// 1. Read all tools from pdfTools.ts
const pdfToolsContent = fs.readFileSync('src/config/pdfTools.ts', 'utf8');
const slugRegex = /slug:\s*['"]\/([^'"]+)['"]/g;
const allToolSlugs = [];
let match;
while ((match = slugRegex.exec(pdfToolsContent)) !== null) {
  allToolSlugs.push(match[1]);
}

const knownToolsStr = "const KNOWN_TOOLS = [\n  '" + allToolSlugs.join("', '") + "'\n];";

// 2. Patch postbuild.mjs
let postbuild = fs.readFileSync('postbuild.mjs', 'utf8');
postbuild = postbuild.replace(/const KNOWN_TOOLS = \[[\s\S]*?\];/, knownToolsStr);
fs.writeFileSync('postbuild.mjs', postbuild);

// 3. Patch publicDynamicRoutes.ts
let dynamicRoutes = fs.readFileSync('server/routes/publicDynamicRoutes.ts', 'utf8');
dynamicRoutes = dynamicRoutes.replace(/const KNOWN_TOOLS = \[[\s\S]*?\];/, knownToolsStr);
fs.writeFileSync('server/routes/publicDynamicRoutes.ts', dynamicRoutes);

console.log(`Successfully patched sitemaps to include ${allToolSlugs.length} tools!`);
