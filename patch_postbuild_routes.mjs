import fs from 'fs';

let content = fs.readFileSync('postbuild.mjs', 'utf8');

const missingRoutes = `
    { slug: 'pdf-to-word', title: 'PDF to Word', desc: 'Convert PDF to editable Word document.' },
    { slug: 'pdf-to-jpg', title: 'PDF to JPG', desc: 'Convert PDF to JPG images.' },
    { slug: 'jpg-to-pdf', title: 'JPG to PDF', desc: 'Convert JPG images to PDF.' },
    { slug: 'convert-pdf', title: 'Convert PDF', desc: 'Convert to and from PDF.' },
    { slug: 'organize-pdf-tools', title: 'Organize PDF Tools', desc: 'Organize your PDF files.' },
    { slug: 'edit-pdf-tools', title: 'Edit PDF Tools', desc: 'Tools to edit PDFs.' },
    { slug: 'pdf-security', title: 'PDF Security Tools', desc: 'Secure your PDFs.' },
    { slug: 'pdf-ai-tools', title: 'AI PDF Tools', desc: 'AI-powered PDF tools.' },
`;

if (!content.includes('pdf-to-word')) {
    content = content.replace(
        "{ slug: 'unlock-pdf', title: 'Unlock PDF', desc: 'Remove PDF password security.' },",
        `{ slug: 'unlock-pdf', title: 'Unlock PDF', desc: 'Remove PDF password security.' },\n${missingRoutes}`
    );
    fs.writeFileSync('postbuild.mjs', content);
    console.log("Patched postbuild.mjs with missing static routes.");
} else {
    console.log("Routes already exist in postbuild.mjs");
}
