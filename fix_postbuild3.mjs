import fs from 'fs';

let content = fs.readFileSync('postbuild.mjs', 'utf8');

// Fix the corrupted top of the file
content = content.replace(/let robots = cmsData\.robotsTxt \|\| `User-agent: \*\\nAllow: \/\\nAllow: \/assets\/\\nDisallow: \/admin\/\\nDisallow: \/user\/\\nDisallow: \/api\/\\nDisallow: \/download\/\\nDisallow: \/result\/\\nDisallow: \/session\/\\n\\nSitemap: \$\{domain\}\/sitemap\.xml`;/, '');

fs.writeFileSync('postbuild.mjs', content);
console.log("Fixed top of postbuild.mjs");
