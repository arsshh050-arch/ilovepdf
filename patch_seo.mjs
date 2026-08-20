import fs from 'fs';
let content = fs.readFileSync('src/components/SEO.tsx', 'utf8');
content = content.replace(/<meta property="og:site_name" content=".*?" \/>/, '<meta property="og:site_name" content="iLovePDF.in" />');
fs.writeFileSync('src/components/SEO.tsx', content);
