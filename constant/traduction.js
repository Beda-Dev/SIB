export const traduction = (value) => {
    if (value === "PENDING") return "En attente";
    if (value === "PROGRESS") return "En cours de traitement";
    if (value === "DONE") return "Effectuée";
    if (value === "CANCELED") return "Annulée";
  };