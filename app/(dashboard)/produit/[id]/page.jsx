"use client";

import React, { useEffect, useState } from "react";
import { GetProduitById } from "../api_recherche_produit.jsx";

const VoirProduit = ({ params }) => {
  const [produit, setProduit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const { id } = params;;

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
    return <p className="text-center text-gray-500 animate-pulse">Chargement...</p>;
  }

  if (!produit) {
    return <p className="text-center text-red-500">Produit introuvable.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Détails du Produit</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <img
            src={produit.images?.[0]?.url}
            alt={produit.label}
            className="w-full rounded-lg object-cover shadow-md"
          />
          <div className="flex mt-4 space-x-2">
            {produit.images?.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Image ${index + 1}`}
                className="w-16 h-16 object-cover rounded-md border cursor-pointer hover:opacity-75"
                
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700">{produit.label}</h2>
          <p className="text-md text-gray-500 mb-4">{ 'Categorie : '+ produit.category?.label || "Catégorie inconnue"}</p>
          <div className="text-xl font-bold text-gray-800 mb-4">
            ${produit.unit_price}
          </div>

          <div className="mt-4">
            <div className="flex space-x-2 mt-2">
              {produit.sizes?.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded transition-colors duration-200 ${
                    selectedSize === size ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-600">Description :</h3>
            <p className="text-gray-600 mt-2">{produit.description || "Aucune description disponible."}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VoirProduit;
