"use server";


export const AjouterProduit = async (formData) => {
  try {

    const response = await fetch("https://sibeton-api.vercel.app/api/product", {
      method: "POST",
      body:formData,
    });

    const data = await response.json();

    if (response.ok) {
      console.info("Produit ajouté avec succès :", data);
      return { success: true, data };
    } else {
      console.warn("Erreur API :", data.message);
      return { success: false, message: data.message || "Erreur lors de l'ajout du produit." };
    }
  } catch (error) {
    console.error("Erreur durant la création :", error);
    return { success: false, message: "Une erreur est survenue lors de l'ajout du produit." };
  }
};


