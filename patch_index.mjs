import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

// replace <title>iLovePDF.in | Free & Secure Online PDF Processing Tools</title>
content = content.replace(/<title>.*?<\/title>/, "<title>Online PDF Tools for Everyday Document Tasks | iLovePDF.in</title>");

// Ensure favicon links are correct
if (!content.includes('<link rel="icon" href="/favicon.ico" />')) {
  content = content.replace('<link rel="shortcut icon" href="/favicon.ico" />', 
    '<link rel="icon" href="/favicon.ico" sizes="any" />\n    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />\n    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />');
}

fs.writeFileSync('index.html', content);
console.log('Patched index.html');
