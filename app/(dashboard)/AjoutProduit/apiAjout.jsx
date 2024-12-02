"use server";


export const AjouterProduit = async ({ libelle, description, categorie, images }) => {
  if (!libelle || libelle.trim() === "") {
    return { success: false, message: "Le libellé est requis." };
  }
  if (!description || description.trim() === "") {
    return { success: false, message: "La description est requise." };
  }
  if (!categorie) {
    return { success: false, message: "La catégorie est requise." };
  }
  if (!images || images.length === 0) {
    return { success: false, message: "Au moins une image est requise." };
  }

  try {

    const response = await fetch("https://sibeton-api.vercel.app/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: libelle,
        description,
        categoryId: categorie,
        images,
      }),
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
