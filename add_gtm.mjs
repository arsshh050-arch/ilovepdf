import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const gtmHead = `
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-KN698LLP');</script>
    <!-- End Google Tag Manager -->
`;

const gtmBody = `
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KN698LLP"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
`;

if (!html.includes('GTM-KN698LLP')) {
  html = html.replace('<head>', '<head>' + gtmHead);
  html = html.replace(/<body[^>]*>/, match => match + gtmBody);
  fs.writeFileSync('index.html', html);
  console.log('Successfully injected Google Tag Manager code into index.html');
} else {
  console.log('GTM code already exists in index.html');
}
