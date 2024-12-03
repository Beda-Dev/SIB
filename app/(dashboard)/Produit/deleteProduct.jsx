"use server";

export const handleDelete = async (productId) => {
  try {
    const response = await fetch(
      `https://sibeton-api.vercel.app/api/product/${productId}`,
      {
        method: "DELETE",
        headers: {
            "Accept": "*/*",
            "User-Agent":"https://localhost:3000",
            
          },
      }
    );

    if (response.ok) {
      console.log(`Produit avec l'ID ${productId} supprimé avec succès`);
    } else {
      const errorData = await response.json();
      console.error("Erreur lors de la suppression :", errorData);
    }
  } catch (error) {
    console.error("Une erreur est survenue :", error);
  }
};
