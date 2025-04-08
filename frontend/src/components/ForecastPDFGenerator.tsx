// src/components/ForecastPDFGenerator.tsx
import React from "react";
import { generateForecastPDF } from "../utils/pdfGenerator";

const ForecastPDFGenerator: React.FC = () => {
  return (
    <button
      onClick={generateForecastPDF}
      className=" text-purple-700 px-6 py-3 rounded-full text-lg shadow-md hover:bg-purple-100 hover:shadow-lg transition !bg-white"
    >
      📄 Download Full Forecast Report
    </button>
  );
};

export default ForecastPDFGenerator;
