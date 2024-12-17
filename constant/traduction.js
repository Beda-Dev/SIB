export const traduction = (value) => {
    if (value.toUpperCase() === "PENDING") return "En attente";
    if (value.toUpperCase() === "PROGRESS") return "En cours de traitement";
    if (value.toUpperCase() === "DONE") return "Effectuée";
    if (value.toUpperCase() === "CANCELED") return "Annulée";
  };