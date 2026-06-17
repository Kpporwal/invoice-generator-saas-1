import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function generateInvoicePDF(
  element: HTMLElement,
  invoiceNumber: string
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/png", 1.0);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // One page invoice
  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    imgWidth,
    Math.min(imgHeight, pageHeight)
  );

  pdf.save(`Invoice-${invoiceNumber}.pdf`);
}