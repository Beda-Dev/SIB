"use server";

export const modification_categorie = async (id, data) => {
  try {
    const response = await fetch(
      `https://sibeton-api.vercel.app/api/category/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({label : data})
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



export const Recherche = async () => {
  try {
    const response = await fetch("https://sibeton-api.vercel.app/api/category");

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      console.warn("Erreur API :", data.message);
      return { success: false, message: data.message || "Erreur de création." };
    }
  } catch (error) {
    console.error("Erreur :", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la requete.",
    };
  }
};
