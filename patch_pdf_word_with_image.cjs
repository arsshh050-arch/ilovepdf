const fs = require('fs');
let code = fs.readFileSync('src/utils/pdfProcessor.ts', 'utf8');

// First, make sure ImageRun is imported
if (!code.includes('ImageRun')) {
    code = code.replace('import { Document, Packer, Paragraph, TextRun } from "docx";', 'import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";');
}

const newPdfToWord = `async function clientPdfToWord(file: File, settings: Record<string, any>): Promise<ProcessingResult> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  
  const mode = settings.mode || 'no-ocr';
  const sections: any[] = [];

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });
    const widthTwips = Math.round(viewport.width * 20);
    const heightTwips = Math.round(viewport.height * 20);
    
    // Render page as image for the background
    const renderViewport = page.getViewport({ scale: 2.0 }); 
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = renderViewport.width;
    canvas.height = renderViewport.height;
    await page.render({ canvasContext: ctx, viewport: renderViewport } as any).promise;
    const dataUrl = canvas.toDataURL('image/png');
    // Convert base64 to buffer
    const base64Data = dataUrl.replace(/^data:image\\/png;base64,/, "");
    
    // In browser context, we can just use Uint8Array or Buffer for ImageRun data
    // Buffer is available via browser polyfills or we can convert it manually
    const binary_string = atob(base64Data);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let j = 0; j < len; j++) {
        bytes[j] = binary_string.charCodeAt(j);
    }
    
    const paragraphs: Paragraph[] = [];
    
    // Add background image
    paragraphs.push(new Paragraph({
      children: [
        new ImageRun({
          data: bytes,
          transformation: {
            width: viewport.width,
            height: viewport.height,
          },
          floating: {
            horizontalPosition: { offset: 0 },
            verticalPosition: { offset: 0 },
            wrap: { type: 0 }, // NONE
            behindDocument: true,
          }
        })
      ]
    }));

    if (mode === 'ocr') {
       // OCR Mode: Run tesseract
       const result = await Tesseract.recognize(dataUrl, 'eng');
       const lines = result.data.text.split('\\n');
       
       for (const line of lines) {
          if (line.trim().length > 0) {
             paragraphs.push(new Paragraph({ children: [new TextRun(line.trim())] }));
          }
       }
    } else {
      const textContent = await page.getTextContent();
      const items = textContent.items as any[];
      
      if (items.length > 0) {
        // Sort items: top-to-bottom, then left-to-right
        items.sort((a, b) => {
           const yDiff = b.transform[5] - a.transform[5];
           if (Math.abs(yDiff) > 5) return yDiff;
           return a.transform[4] - b.transform[4];
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

          const pdfY = firstItem.transform[5];
          const pdfX = firstItem.transform[4];
          const fontSizePt = Math.max(8, Math.abs(firstItem.transform[3] || firstItem.transform[0] || 12));
          const topY = viewport.height - pdfY - (fontSizePt * 0.8);
          
          const xTwips = Math.max(0, Math.round(pdfX * 20));
          const yTwips = Math.max(0, Math.round(topY * 20));
          const textWidthTwips = Math.max(2000, Math.round((viewport.width - pdfX) * 20));

          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: lineText, size: Math.round(fontSizePt * 2), color: "auto" })],
            frame: {
              position: {
                x: xTwips,
                y: yTwips,
              },
              width: textWidthTwips,
              height: Math.round(fontSizePt * 20 * 1.5),
              anchor: {
                horizontal: 'page',
                vertical: 'page',
              },
              wrap: {
                type: 0,
              }
            }
          }));
        }
      }
    }
    
    sections.push({
      properties: {
        page: {
          size: { width: widthTwips, height: heightTwips },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
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
