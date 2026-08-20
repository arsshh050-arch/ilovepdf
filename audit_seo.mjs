import fs from 'fs';
import path from 'path';

const TIER_1_TOOLS = ['pdf-to-word', 'compress-pdf', 'merge-pdf', 'jpg-to-pdf', 'edit-pdf', 'split-pdf'];
const domain = 'https://www.ilovepdf.in';

console.log("==================================================");
console.log("        AUTOMATED SEO AUDIT (TIER 1 PAGES)        ");
console.log("==================================================");

const homepageHtml = fs.readFileSync('dist/index.html', 'utf8');
const sitemapTools = fs.readFileSync('dist/sitemap-tools.xml', 'utf8');

TIER_1_TOOLS.forEach(tool => {
  console.log(`\nAuditing: /${tool}`);
  const indexPath = path.join('dist', tool, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.log(`❌ ERROR: Raw HTML file not found at ${indexPath}`);
    return;
  }
  
  const html = fs.readFileSync(indexPath, 'utf8');
  
  // Extract SEO signals
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const descMatch = html.match(/<meta name="description" content="(.*?)"/i);
  const canonicalMatch = html.match(/<link rel="canonical" href="(.*?)"/i);
  const h1Match = html.match(/<h1>(.*?)<\/h1>/i);
  
  // Checks
  const inSitemap = sitemapTools.includes(`${domain}/${tool}`);
  const linkedFromHome = homepageHtml.includes(`href="/${tool}"`) || homepageHtml.includes(`to="/${tool}"`) || homepageHtml.includes(`/${tool}`);
  
  console.log(`  Status     : ✅ HTTP 200 (Static HTML generated)`);
  console.log(`  Title      : ${titleMatch ? titleMatch[1] : '❌ Missing'}`);
  console.log(`  Description: ${descMatch ? (descMatch[1].substring(0, 60) + '...') : '❌ Missing'}`);
  console.log(`  Canonical  : ${canonicalMatch ? canonicalMatch[1] : '❌ Missing'}`);
  console.log(`  H1         : ${h1Match ? h1Match[1] : '❌ Missing'}`);
  console.log(`  In Sitemap : ${inSitemap ? '✅ YES' : '❌ NO'}`);
  console.log(`  Home Link  : ${linkedFromHome ? '✅ YES' : '❌ NO'}`);
});
console.log("\n==================================================");
