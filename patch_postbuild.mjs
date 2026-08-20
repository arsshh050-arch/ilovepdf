import fs from 'fs';

let content = fs.readFileSync('postbuild.mjs', 'utf8');

content = content.replace(/const seoItem = toolsSeoData\[route\.slug\];/, `const seoItem = toolsSeoData['/' + route.slug];`);

fs.writeFileSync('postbuild.mjs', content);
