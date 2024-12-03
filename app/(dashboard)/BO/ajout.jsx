"use server";

export const Categorieproduit = async (label) => {
  if (!label || label.trim() === "") {
    return { success: false, message: "Le libellé est requis." };
  }

  try {
    const response = await fetch("https://sibeton-api.vercel.app/api/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        
      },
      body: JSON.stringify({ label }),
    });

    const data = await response.json();

    if (response.ok) {
      console.info("Catégorie créée :", data);
      return { success: true, data };
    } else {
      console.warn("Erreur API :", data.message);
      return { success: false, message: data.message || "Erreur de création." };
    }
  } catch (error) {
    console.error("Erreur durant la création :", error);
    return { success: false, message: "Une erreur est survenue lors de la création de la catégorie." };
  }
};
