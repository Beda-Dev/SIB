"use server";


export const GetProduitById = async (id) => {
  const response = await fetch(`https://sibeton-api.vercel.app/api/product/${id}`);
  const data = await response.json();

  if (response.ok) {
    console.log(data)
    return { success: true, data };
  }
  else return { success: false, message: data.message};
};



export const RechercheProduit = async () => {
  try {
    const response = await fetch("https://sibeton-api.vercel.app/api/product");

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      console.warn("Erreur API :", data.message);
      return { success: false, message: data.message || "Erreur de création." };
    }
  } catch (error) {
    console.error("Erreur :", error);
    return { success: false, message: "Une erreur est survenue lors de la requete." };
  }
};
