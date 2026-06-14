import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function generateInvoicePDF(
  element: HTMLElement,
  invoiceNumber: string
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  if (imgHeight <= pdfHeight) {
    const yOffset = (pdfHeight - imgHeight) / 2;
    pdf.addImage(imgData, 'PNG', 0, Math.max(0, yOffset), imgWidth, imgHeight);
  } else {
    let remainingHeight = imgHeight;
    let sourceY = 0;
    const sourcePageHeight = canvas.height * (pdfHeight / imgHeight);

    while (remainingHeight > 0) {
      const sliceHeight = Math.min(sourcePageHeight, canvas.height - sourceY);

      // Create a sub-canvas for this page
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;
      const ctx = pageCanvas.getContext('2d');
      if (!ctx) break;
      ctx.drawImage(
        canvas,
        0, sourceY, canvas.width, sliceHeight,
        0, 0, canvas.width, sliceHeight
      );

      const pageImgData = pageCanvas.toDataURL('image/png');
      const pageImgHeight = (sliceHeight * pdfWidth) / canvas.width;

      if (sourceY > 0) {
        pdf.addPage();
      }
      pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageImgHeight);

      sourceY += sourcePageHeight;
      remainingHeight -= pdfHeight;
    }
  }

  pdf.save(`Invoice-${invoiceNumber}.pdf`);
}
