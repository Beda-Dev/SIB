"use server"

export const modification_produit = async ({id, formData}) => {

  const logFormDataTypes = (formData) => {
    for (const [key, value] of formData.entries()) {
      console.log(`Key: ${key}, Value: ${value}, Type: ${typeof value}`);}}

  console.log('VOICI les donnée recu par l api pour la modification :')
  logFormDataTypes(formData)
    try {
      const response = await fetch(
        `https://sibeton-api.vercel.app/api/product/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      
      const responseData = await response.json();
      console.log(responseData)
  
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