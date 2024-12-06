"use client";

import React, { useEffect, useState } from "react";

import { GetProduitById } from "./api_recherche_produit.jsx";

const VoirProduit = ({ id }) => {
  const [produit, setProduit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  

  useEffect(() => {
    const fetchProduit = async () => {
      setIsLoading(true);
      try {
        const response = await GetProduitById(id);
        if (response?.data?.data) {
          setProduit(response.data.data);
        } else {
          console.error("Aucune donnée trouvée pour le produit.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduit();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-center text-gray-500 text-lg animate-pulse">
          Chargement...
        </p>
      </div>
    );
  }

  if (!produit) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-center text-red-500 text-lg font-medium">
          Produit introuvable.
        </p>
      </div>
    );
  }

  return (
    <>
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Détails du Produit
        </h1>
        <p className="text-gray-500">Découvrez les détails du produit sélectionné.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section Image */}
        <section className="space-y-6 flex">
          <img
            src={produit.images?.[0]?.url}
            alt={produit.label}
            className="w-64 h-64 rounded-lg object-cover shadow-md transition-transform duration-300 hover:scale-105"
          />
          <div className="flex space-x-3">
            {produit.images?.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Image ${index + 1}`}
                className="w-16 h-16 object-cover rounded-md border border-gray-200 cursor-pointer transition-transform duration-200 hover:scale-110"
              />
            ))}
          </div>
        </section>

        {/* Section Détails */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800">{produit.label}</h2>
          <p className="text-md text-gray-500">
            Catégorie :{" "}
            <span className="text-gray-700 font-medium">
              {produit.category?.label || "Catégorie inconnue"}
            </span>
          </p>
          <div className="text-2xl font-bold text-gray-800">
            ${produit.unit_price}
            <div className="flex space-x-3">
              {produit.sizes?.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg transition-colors duration-300 ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-medium text-gray-700">Description :</h3>
            <p className="text-gray-600 mt-2">
              {produit.description || "Aucune description disponible."}
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default VoirProduit;
