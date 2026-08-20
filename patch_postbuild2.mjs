import fs from 'fs';

let content = fs.readFileSync('postbuild.mjs', 'utf8');

// Fix body replacement
content = content.replace(/modifiedHtml = modifiedHtml\.replace\(\/<body\>\/i, \`\<body\>\$\{seoShell\}\`\);/, 
`modifiedHtml = modifiedHtml.replace(/<body(.*?)>/i, \`<body$1>\${seoShell}\`);`);

fs.writeFileSync('postbuild.mjs', content);
