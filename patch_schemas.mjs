import fs from 'fs';

// Patch websiteSchema
let webSchema = fs.readFileSync('src/seo/schema/websiteSchema.ts', 'utf8');
webSchema = webSchema.replace(/name: 'ilovepdf.in'/, "name: 'iLovePDF.in'");
fs.writeFileSync('src/seo/schema/websiteSchema.ts', webSchema);

// Patch organizationSchema
let orgSchema = fs.readFileSync('src/seo/schema/organizationSchema.ts', 'utf8');
orgSchema = orgSchema.replace(/name: 'ilovepdf.in'/g, "name: 'iLovePDF.in'");
fs.writeFileSync('src/seo/schema/organizationSchema.ts', orgSchema);

console.log('Patched schemas');
