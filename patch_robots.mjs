import fs from 'fs';

let content = fs.readFileSync('postbuild.mjs', 'utf8');

const newRobots = `User-agent: *\\nAllow: /\\nAllow: /assets/\\nDisallow: /admin/\\nDisallow: /user/\\nDisallow: /api/\\nDisallow: /download/\\nDisallow: /result/\\nDisallow: /session/\\n\\nSitemap: \${domain}/sitemap.xml`;

content = content.replace(/let robots = cmsData\.robotsTxt || .*;/, `let robots = cmsData.robotsTxt || \`${newRobots}\`;`);

fs.writeFileSync('postbuild.mjs', content);
console.log("Patched postbuild.mjs for robots.txt.");
