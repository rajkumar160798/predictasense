import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportPDF = async (elementId: string, title: string) => {
  const input = document.getElementById(elementId);
  if (!input) return;

  const canvas = await html2canvas(input, {
    scale: 2,
    scrollX: 0,
    scrollY: -window.scrollY,
    useCORS: true
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = (canvas.height * pageWidth) / canvas.width;

  pdf.setFontSize(16);
  pdf.text(title, 15, 15);
  pdf.addImage(imgData, "PNG", 10, 20, pageWidth - 20, pageHeight);
  pdf.save("ProvansIQ_Report.pdf");
};
