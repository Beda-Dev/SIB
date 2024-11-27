"use server"
import {hashPassword , comparePasswords} from "./cryptagepassword"

export const loginUser = async (email, password) => {
    const NewPassword = await hashPassword(password)
    console.log(email , NewPassword)
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, NewPassword }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || "Erreur de connexion" };
      }
    } catch (error) {
      console.error("Error during login:", error);
      return { success: false, message: "Une erreur est survenue lors de la connexion" };
    }
  };
  