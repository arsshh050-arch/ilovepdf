const fs = require('fs');
let code = fs.readFileSync('src/utils/pdfProcessor.ts', 'utf8');

const newPdfToWord = `async function clientPdfToWord(file: File, settings: Record<string, any>): Promise<ProcessingResult> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  
  const mode = settings.mode || 'no-ocr';
  const sections: any[] = [];

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });
    
    const paragraphs: Paragraph[] = [];
    
    if (mode === 'ocr') {
       // OCR Mode: Run tesseract
       const renderViewport = page.getViewport({ scale: 2.0 }); 
       const canvas = document.createElement('canvas');
       const ctx = canvas.getContext('2d')!;
       canvas.width = renderViewport.width;
       canvas.height = renderViewport.height;
       await page.render({ canvasContext: ctx, viewport: renderViewport } as any).promise;
       
       const dataUrl = canvas.toDataURL('image/png');
       const result = await Tesseract.recognize(dataUrl, 'eng');
       const lines = result.data.text.split('\\n');
       
       for (const line of lines) {
          if (line.trim().length > 0) {
             paragraphs.push(new Paragraph({ children: [new TextRun({ text: line.trim(), size: 24 })] }));
          }
       }
    } else {
      const textContent = await page.getTextContent();
      const items = textContent.items as any[];
      
      if (items.length > 0) {
        // Sort items: top-to-bottom (highest Y first since PDF Y is from bottom usually), then left-to-right
        items.sort((a, b) => {
           const yDiff = b.transform[5] - a.transform[5];
           if (Math.abs(yDiff) > 5) return yDiff; // Different lines
           return a.transform[4] - b.transform[4]; // Same line, sort by X
        });

        let currentLine = [];
        let lines = [];
        let currentY = -1;

        for (const item of items) {
          const y = Math.round(item.transform[5]); 
          if (currentY !== -1 && Math.abs(currentY - y) > 5 && currentLine.length > 0) {
             lines.push(currentLine);
             currentLine = [item];
             currentY = y;
          } else {
             if (currentY === -1) currentY = y;
             currentLine.push(item);
          }
        }
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }

        for (const line of lines) {
          if (line.length === 0) continue;
          
          const firstItem = line[0];
          let lineText = line.map(it => it.str).join(' ').trim();
          if (!lineText) continue;

          const fontSizePt = Math.max(10, Math.abs(firstItem.transform[3] || firstItem.transform[0] || 12));
          
          // Basic alignment check
          const pdfX = firstItem.transform[4];
          let alignment = 'left'; // AlignmentType.LEFT
          if (pdfX > viewport.width * 0.35 && pdfX < viewport.width * 0.65) {
             alignment = 'center'; // AlignmentType.CENTER
          } else if (pdfX >= viewport.width * 0.65) {
             alignment = 'right'; // AlignmentType.RIGHT
          }

          paragraphs.push(new Paragraph({
            alignment: alignment as any,
            children: [
              new TextRun({ 
                text: lineText, 
                size: Math.round(fontSizePt * 2) 
              })
            ]
          }));
        }
      }
    }
    
    if (paragraphs.length === 0) {
       paragraphs.push(new Paragraph({ children: [new TextRun("")] }));
    }

    sections.push({
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        }
      },
      children: paragraphs
    });
  }

  const doc = new Document({ sections });
  const blob = await Packer.toBlob(doc);
  
  return {
    url: URL.createObjectURL(blob),
    filename: file.name.replace(/\\.pdf$/i, '.docx'),
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    sizeBytes: blob.size,
  };
}`;

const regex = /async function clientPdfToWord\(file: File, settings: Record<string, any>\): Promise<ProcessingResult> \{[\s\S]*?return \{\n    url: URL\.createObjectURL\(blob\),\n    filename: file\.name\.replace\(\/\\\.pdf\$\/i, '\.docx'\),\n    mimeType: 'application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document',\n    sizeBytes: blob\.size,\n  \};\n\}/;

code = code.replace(regex, newPdfToWord);
fs.writeFileSync('src/utils/pdfProcessor.ts', code);
