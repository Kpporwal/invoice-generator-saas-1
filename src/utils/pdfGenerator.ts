import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function generateInvoicePDF(
  element: HTMLElement,
  invoiceNumber: string
): Promise<void> {

  const canvas = await html2canvas(element, {
    scale: 4,
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

  pdf.setProperties({
    title: `Invoice ${invoiceNumber}`,
    subject: "GST Tax Invoice",
    author: "BillNova",
    creator: "BillNova Smart GST Billing Software",
    keywords: "GST, Invoice, BillNova",
  });

  const pageWidth = 210;
  const pageHeight = 297;

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    imgWidth,
    Math.min(imgHeight, pageHeight),
    undefined,
    "FAST"
  );

  pdf.save(`Invoice-${invoiceNumber}.pdf`);
}