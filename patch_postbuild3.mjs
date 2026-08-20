import fs from 'fs';

let content = fs.readFileSync('postbuild.mjs', 'utf8');

const replacement = `
      let linksHtml = '';
      if (route.slug === '' || route.slug === '/') {
        linksHtml = \`
        <nav>
          <ul>
            <li><a href="/pdf-to-word">PDF to Word</a></li>
            <li><a href="/compress-pdf">Compress PDF</a></li>
            <li><a href="/merge-pdf">Merge PDF</a></li>
            <li><a href="/jpg-to-pdf">JPG to PDF</a></li>
            <li><a href="/edit-pdf">PDF Editor</a></li>
            <li><a href="/split-pdf">Split PDF</a></li>
          </ul>
        </nav>\`;
      }
      
      const seoShell = \`    <noscript>
      <header>
        <h1>\${route.h1 || route.title}</h1>
        <p>\${route.desc || ''}</p>
        \${linksHtml}
      </header>
    </noscript>\`;`;

content = content.replace(/const seoShell = \`\s*<noscript>\s*<header>\s*<h1>\$\{route\.h1 \|\| route\.title\}<\/h1>\s*<p>\$\{route\.desc \|\| ''\}<\/p>\s*<\/header>\s*<\/noscript>\`;/, replacement);

fs.writeFileSync('postbuild.mjs', content);
