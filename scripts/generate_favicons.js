import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Clean SVG icon with vibrant red background (#E5322D) and white heart/PDF emblem
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="112" fill="#E5322D" />
  <g transform="translate(70, 70) scale(1.7714)">
    <!-- Heart / PDF Emblem -->
    <path transform="translate(-70, -145)" d="m 176.88264,313.15341 c -8.77108,-13.4004 -26.64901,-30.39733 -44.49236,-42.29985 -17.79483,-11.87015 -26.28718,-19.926 -31.11785,-29.51844 -13.621722,-27.04913 0.77468,-57.88615 30.59046,-65.5246 10.83662,-2.77621 24.19576,-0.19852 34.05434,6.5709 4.8114,3.30376 11.75956,10.66589 14.81439,15.69703 1.0173,1.67543 1.32818,1.5382 3.79448,-1.67505 4.09579,-5.33626 13.44291,-14.32458 16.58305,-15.9465 l 2.80052,-1.44651 30.10697,30.10698 30.10698,30.10698 -1.37132,3.31066 c -2.60275,6.28358 -14.46009,17.31636 -30.10078,28.00755 -22.85432,15.62208 -36.52027,28.813 -46.35067,44.7395 -2.07807,3.36674 -3.8323,6.12135 -3.89829,6.12135 -0.066,0 -2.54995,-3.7125 -5.51992,-8.25 z" fill="#FFFFFF" />
    <path transform="translate(-70, -145)" d="m 258.80681,241.14671 c 0,-0.14118 -12.6,-12.85067 -28,-28.24331 l -28,-27.9866 v 28.2433 28.24331 h 28 c 15.4,0 28,-0.11552 28,-0.2567 z" fill="#E5322D" />
  </g>
</svg>`;

// Social Share Open Graph Banner (1200x630)
const ogSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F8F9FA"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Subtle Red Accent Top Bar -->
  <rect width="1200" height="12" fill="#E5322D"/>

  <!-- Logo Group -->
  <g transform="translate(180, 215)">
    <!-- Red Square Icon -->
    <rect width="200" height="200" rx="44" fill="#E5322D"/>
    <g transform="translate(27, 27) scale(0.69)">
      <path transform="translate(-70, -145)" d="m 176.88264,313.15341 c -8.77108,-13.4004 -26.64901,-30.39733 -44.49236,-42.29985 -17.79483,-11.87015 -26.28718,-19.926 -31.11785,-29.51844 -13.621722,-27.04913 0.77468,-57.88615 30.59046,-65.5246 10.83662,-2.77621 24.19576,-0.19852 34.05434,6.5709 4.8114,3.30376 11.75956,10.66589 14.81439,15.69703 1.0173,1.67543 1.32818,1.5382 3.79448,-1.67505 4.09579,-5.33626 13.44291,-14.32458 16.58305,-15.9465 l 2.80052,-1.44651 30.10697,30.10698 30.10698,30.10698 -1.37132,3.31066 c -2.60275,6.28358 -14.46009,17.31636 -30.10078,28.00755 -22.85432,15.62208 -36.52027,28.813 -46.35067,44.7395 -2.07807,3.36674 -3.8323,6.12135 -3.89829,6.12135 -0.066,0 -2.54995,-3.7125 -5.51992,-8.25 z" fill="#FFFFFF" />
      <path transform="translate(-70, -145)" d="m 258.80681,241.14671 c 0,-0.14118 -12.6,-12.85067 -28,-28.24331 l -28,-27.9866 v 28.2433 28.24331 h 28 c 15.4,0 28,-0.11552 28,-0.2567 z" fill="#E5322D" />
    </g>

    <!-- Text Group -->
    <text x="250" y="95" font-family="Inter, sans-serif" font-weight="800" font-size="76" fill="#272830">iLovePDF.in</text>
    <text x="250" y="150" font-family="Inter, sans-serif" font-weight="600" font-size="32" fill="#E5322D">100% Free Online PDF Tools</text>
    <text x="250" y="195" font-family="Inter, sans-serif" font-weight="400" font-size="24" fill="#686B74">Merge, Split, Compress, Convert &amp; Edit PDFs</text>
  </g>
</svg>`;

function createIcoBuffer(pngBuffersWithSize) {
  const count = pngBuffersWithSize.length;
  const headerSize = 6;
  const directorySize = 16 * count;
  let offset = headerSize + directorySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const directories = [];
  const imageDatas = [];

  for (const item of pngBuffersWithSize) {
    const dir = Buffer.alloc(16);
    dir.writeUInt8(item.size >= 256 ? 0 : item.size, 0);
    dir.writeUInt8(item.size >= 256 ? 0 : item.size, 1);
    dir.writeUInt8(0, 2);
    dir.writeUInt8(0, 3);
    dir.writeUInt16LE(1, 4);
    dir.writeUInt16LE(32, 6);
    dir.writeUInt32LE(item.buffer.length, 8);
    dir.writeUInt32LE(offset, 12);

    directories.push(dir);
    imageDatas.push(item.buffer);
    offset += item.buffer.length;
  }

  return Buffer.concat([header, ...directories, ...imageDatas]);
}

async function generate() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Save SVG
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf-8');
  console.log('Saved public/favicon.svg');

  const svgBuffer = Buffer.from(svgContent);

  const targets = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'favicon-96x96.png', size: 96 },
    { name: 'favicon-192x192.png', size: 192 },
    { name: 'favicon-512x512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 }
  ];

  const icoItems = [];

  for (const t of targets) {
    const filePath = path.join(publicDir, t.name);
    const pngBuffer = await sharp(svgBuffer)
      .resize(t.size, t.size)
      .png({ compressionLevel: 9 })
      .toBuffer();
    
    fs.writeFileSync(filePath, pngBuffer);
    console.log(`Generated ${t.name} (${t.size}x${t.size})`);

    if ([16, 32, 48, 96].includes(t.size) && !t.name.startsWith('android')) {
      icoItems.push({ size: t.size, buffer: pngBuffer });
    }
  }

  // Build binary multi-resolution .ico file
  const icoBuffer = createIcoBuffer(icoItems);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log(`Generated public/favicon.ico (${icoBuffer.length} bytes, containing 16px, 32px, 48px icons)`);

  // Build Social Share Open Graph Banner (1200x630)
  const ogBuffer = await sharp(Buffer.from(ogSvgContent)).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogBuffer);
  console.log(`Generated public/og-image.png (1200x630)`);
}

generate().catch(err => {
  console.error('Generation error:', err);
  process.exit(1);
});
