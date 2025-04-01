// src/components/ForecastPDFGenerator.tsx
import React from "react";
import { generateForecastPDF } from "../utils/pdfGenerator";

const ForecastPDFGenerator: React.FC = () => {
  return (
    <button
      onClick={generateForecastPDF}
      className="bg-purple-700 text-blue px-4 py-2 rounded hover:bg-purple-800 mt-4"
    >
      📄 Download Full Forecast Report
    </button>
  );
};

export default ForecastPDFGenerator;
