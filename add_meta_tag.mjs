import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('google-site-verification')) {
  html = html.replace('<head>', '<head>\n    <meta name="google-site-verification" content="x2o5SH5zLuydGQyS7uIgHGHLC_1lyT8gq_acS9NJZn0" />');
  fs.writeFileSync('index.html', html);
  console.log('Successfully added meta tag to index.html');
} else {
  console.log('Meta tag already exists in index.html');
}
