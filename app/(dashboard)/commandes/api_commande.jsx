export const getOrder = async () => {
  try {
    const response = await fetch("https://sibeton-api.vercel.app/api/order");

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      console.warn("Erreur API :", data.message);
      return {
        success: false,
        message: data.message || "Erreur lors de l'obtention des commandes.",
      };
    }
  } catch (error) {
    console.error("Erreur :", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la requete.",
    };
  }
};
