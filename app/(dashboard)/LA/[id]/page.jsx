"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GetProduitById } from "./../Recproduit";
import Card from "@/components/ui/Card";


const VoirProduit = ({ params }) => {
  const [produit, setProduit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [Id , setId] = useState(params.id)

  useEffect(() => {
    
    const fetchProduit = async () => {
      try {
        setIsLoading(true);
        const data = await GetProduitById(Id);
        if (data) {
          console.log(data.data.data)
          setProduit(data.data.data);
        } else {
          console.error("Aucune donnée récupérée");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduit();
  }, [Id]);

  if (isLoading) return <p className="text-center">Chargement...</p>;

  if (!produit) return <p className="text-center">Produit introuvable</p>;

  return (
    <Card title={`Produit : ${produit.label}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <h3>Libellé</h3>
          <p>{produit.label}</p>
        </div>
        <div>
          <h3>Catégorie</h3>
          <p>{produit.category?.label || "Non spécifié"}</p>
        </div>
        <div className="col-span-2">
          <h3>Description</h3>
          <p>{produit.description}</p>
        </div>
        <div className="col-span-2">
          <h3>Images</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {produit.images?.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Image produit ${index + 1}`}
                className="w-full h-40 object-cover rounded"
              />
            )) || <p>Aucune image disponible</p>}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VoirProduit;
