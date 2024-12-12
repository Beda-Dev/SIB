/**
 
 * @param {File|Blob} pdfFile - Le fichier PDF à envoyer.
 * @param {string} apiUrl - L'URL de l'API qui traite l'envoi par email.
 * @param {Object} options - Options supplémentaires pour l'API (comme l'email du destinataire).
 */
const sendPdfFileByEmail = async (pdfFile, apiUrl, options = {}) => {
    try {
      const pdfBlob = pdfFile instanceof Blob ? pdfFile : new Blob([pdfFile], { type: "application/pdf" });
  
      const formData = new FormData();
      formData.append("file", pdfBlob, "document.pdf");
  
 
      Object.keys(options).forEach((key) => {
        formData.append(key, options[key]);
      });
  

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Erreur API : ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log("PDF envoyé avec succès :", result);
      return result;
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier PDF :", error);
      throw error;
    }
  };
  