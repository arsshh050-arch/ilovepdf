async function clientPdfToPowerpoint(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  
  const pres = new PptxGenJS();
  
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 }); // Higher quality
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
    
    const dataUrl = canvas.toDataURL('image/png');
    
    // Add slide
    const slide = pres.addSlide();
    
    // Calculate slide dimensions based on PDF page aspect ratio?
    // default pptx is 16:9 (10 x 5.625 inches)
    // We can just set background or add image to cover
    slide.addImage({
      data: dataUrl,
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
      sizing: { type: 'contain' }
    });
  }
  
  const blob = await pres.write('blob');
  
  return {
    url: URL.createObjectURL(blob),
    filename: file.name.replace(/\.pdf$/i, '.pptx'),
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    sizeBytes: blob.size,
  };
}
