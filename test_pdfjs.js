import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
const pdf = await pdfjsLib.getDocument('src/assets/sample.pdf').promise.catch(() => null);
// create a simple pdf using some external tool or just download one
