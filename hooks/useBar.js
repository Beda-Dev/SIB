import { useState, useCallback } from "react";

const useBar = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);

    // Fonction toggle avec support pour une valeur explicite
    const toggle = useCallback((value) => {
        if (typeof value === "boolean") {
            setIsOpen(value); // Définit explicitement l'état
        } else {
            setIsOpen((prev) => !prev); // Alterne si aucun paramètre n'est fourni
        }
    }, []);

    return [isOpen, toggle];
};

export default useBar;
