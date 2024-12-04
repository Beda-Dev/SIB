"use server"

export const modification_produit = async (id, data) => {
    try {
      const response = await fetch(
        `https://sibeton-api.vercel.app/api/product/${id}`,
        {
          method: "PUT",
          body: data
        }
      );
  
      const responseData = await response.json();
  
      if (response.ok) {
        return { success: true, data: responseData };
      } else {
        console.warn("Erreur API :", responseData.message);
        return { success: false, message: responseData.message || "Erreur de modification." };
      }
    } catch (error) {
      console.error("Erreur :", error);
      return {
        success: false,
        message: "Une erreur est survenue lors de la requête.",
      };
    }
  };