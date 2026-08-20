import fs from 'fs';

let content = fs.readFileSync('postbuild.mjs', 'utf8');

const badBlockStart = content.indexOf('    }');
const okBlockEnd = content.indexOf('  });\\n  console.log(`Generated ${routes.length} static HTML routes');

// Wait, the regex replace for htmlGenLogic failed properly.
// Let's just fix it manually.
