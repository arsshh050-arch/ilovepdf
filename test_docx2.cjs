const { Document, Packer, Paragraph, TextRun, FrameAnchorType, TextWrappingType } = require('docx');
const doc = new Document({
    sections: [{
        children: [
            new Paragraph({
                children: [new TextRun({ text: "Hello World", size: 24 })],
                frame: {
                    position: {
                        x: 1000,
                        y: 1000,
                    },
                    width: 3000,
                    height: 1000,
                    anchor: {
                        horizontal: FrameAnchorType.PAGE,
                        vertical: FrameAnchorType.PAGE,
                    },
                }
            }),
            new Paragraph({
                children: [new TextRun({ text: "Line 2", size: 24 })],
                frame: {
                    position: {
                        x: 1000,
                        y: 1500,
                    },
                    width: 3000,
                    height: 1000,
                    anchor: {
                        horizontal: FrameAnchorType.PAGE,
                        vertical: FrameAnchorType.PAGE,
                    },
                }
            })
        ]
    }]
});
Packer.toBuffer(doc).then(buf => console.log('success', buf.length)).catch(console.error);
