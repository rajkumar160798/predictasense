// src/utils/pdfGenerator.ts
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const chartIds = [
  "chart-temperature",
  "chart-vibration",
  "chart-pressure",
  "chart-comparative",
  "chart-heatmap",
];

export const generateForecastPDF = async () => {
  const pdf = new jsPDF("p", "pt", "a4");

  for (let i = 0; i < chartIds.length; i++) {
    const chart = document.getElementById(chartIds[i]);
    if (chart) {
      const canvas = await html2canvas(chart);
      const imgData = canvas.toDataURL("image/png");

      if (i !== 0) pdf.addPage();
      pdf.setFontSize(18);
      pdf.text(chartIds[i].replace("chart-", "").toUpperCase(), 40, 40);
      pdf.addImage(imgData, "PNG", 40, 60, 500, 300);

      // Insight
      pdf.setFontSize(12);
      pdf.setTextColor(80);
      pdf.text(getInsight(chartIds[i]), 40, 380, { maxWidth: 520 });
    }
  }

  pdf.save("forecast_report.pdf");
};

const getInsight = (id: string) => {
  switch (id) {
    case "chart-temperature":
      return "Temperature trends help detect overheating or cooling issues. Sudden spikes or drops can signal maintenance needs.";
    case "chart-vibration":
      return "Abnormal vibration patterns may indicate mechanical imbalance, wear and tear, or misalignment.";
    case "chart-pressure":
      return "Pressure anomalies may result from blockages or leaks. Monitor deviations closely.";
    case "chart-comparative":
      return "Comparative analysis gives cross-metric insights. Correlation between temperature, vibration, and pressure can highlight root causes.";
    case "chart-heatmap":
      return "Heatmap highlights anomalies. Red intensity shows frequency and severity. Frequent anomalies at certain hours should trigger inspection.";
    default:
      return "";
  }
};
