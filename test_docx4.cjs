const { Document, Packer, Paragraph, ImageRun, TextWrappingType, TextWrappingSide } = require('docx');
const fs = require('fs');

console.log(TextWrappingType);
console.log(Object.keys(require('docx')).filter(k => k.includes('Wrap') || k.includes('Image')));
