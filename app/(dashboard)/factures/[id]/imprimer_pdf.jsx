"use client";

const PrintPdf = ({ pdfBlob_toPrint }) => {
  if (!pdfBlob_toPrint) {
    console.error("Aucun fichier PDF fourni.");
    return;
  }

  const pdfUrl = URL.createObjectURL(pdfBlob_toPrint);

  const newWindow = window.open(pdfUrl, "_blank");

  if (newWindow) {
    newWindow.onload = () => {
      newWindow.focus();
      newWindow.print();
    };
  }

  setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
};

export default PrintPdf;
