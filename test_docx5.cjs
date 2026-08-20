const { Document, Packer, Paragraph, ImageRun, TextRun, TextWrappingType } = require('docx');

const doc = new Document({
    sections: [{
        children: [
            new Paragraph({
                children: [
                    new ImageRun({
                        data: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64'),
                        transformation: { width: 100, height: 100 },
                        floating: {
                            horizontalPosition: { offset: 0 },
                            verticalPosition: { offset: 0 },
                            wrap: { type: TextWrappingType.NONE },
                            behindDocument: true
                        }
                    }),
                    new TextRun("Hello over image")
                ]
            })
        ]
    }]
});
Packer.toBuffer(doc).then(buf => console.log('success', buf.length)).catch(console.error);
