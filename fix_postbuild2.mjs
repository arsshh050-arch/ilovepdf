import fs from 'fs';

let content = fs.readFileSync('postbuild.mjs', 'utf8');

// Ensure 'robots' is declared once
content = content.replace("fs.writeFileSync('dist/robots.txt', robots);", 
"const robotsText = cmsData.robotsTxt || `User-agent: *\\nAllow: /\\nAllow: /assets/\\nDisallow: /admin/\\nDisallow: /user/\\nDisallow: /api/\\nDisallow: /download/\\nDisallow: /result/\\nDisallow: /session/\\n\\nSitemap: ${domain}/sitemap.xml`;\nfs.writeFileSync('dist/robots.txt', robotsText);");

fs.writeFileSync('postbuild.mjs', content);
console.log("Fixed robots variable declaration.");
