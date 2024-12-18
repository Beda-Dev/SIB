"use server";

export const loginUser = async (email, password) => {
  try {
    const response = await fetch("https://sibeton-api.vercel.app/api/users/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, message: data.message || "Erreur de connexion" };
    }
  } catch (error) {
    console.error("Erreur durant la connexion :", error);
    return { success: false, message: "Une erreur est survenue lors de la connexion" };
  }
};
