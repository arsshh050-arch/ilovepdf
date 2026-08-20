const { Document, Packer, Paragraph, TextRun, FrameAnchorType } = require('docx');
const doc = new Document({
    sections: [{
        properties: {
            page: {
                size: {
                    width: 11906, // A4 width in twips
                    height: 16838, // A4 height in twips
                },
                margin: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                }
            }
        },
        children: [
            new Paragraph({ text: "Hello" })
        ]
    }]
});
Packer.toBuffer(doc).then(buf => console.log('success', buf.length)).catch(console.error);
