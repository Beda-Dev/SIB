"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Imageinput from "@/components/ui/ImageInput";
import { Recherche } from "../ajouter_un_produit/categorie";
import { modification_produit } from "./api_modification_produit";
import { toast } from "react-toastify";
import { GetProduitById } from "../produit/api_recherche_produit.jsx";
import { useRouter } from "next/navigation";

const FormulaireModificationProduit = () => {
  const [arrayData, setArrayData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [libelle, setLibelle] = useState("");
  const [description, setDescription] = useState("");
  const [categorie, setCategorie] = useState("");
  const [images, setImages] = useState([]);
  const [prix, setPrix] = useState(1);
  const [id, setId] = useState(null);

  const router = useRouter();

  const logFormDataTypes = (formData) => {
    for (const [key, value] of formData.entries()) {
      console.log(`Key: ${key}, Value: ${value}, Type: ${typeof value}`);

      // Si `value` est un objet ou un fichier, affichez plus d'informations
      if (value instanceof File) {
        console.log(
          `Key: ${key}, File Name: ${value.name}, File Type: ${value.type}`
        );
      }
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        // Récupération de l'ID depuis sessionStorage
        const storedId = JSON.parse(
          sessionStorage.getItem("id_produit_modifier")
        );
        if (!storedId) throw new Error("Aucun ID de produit trouvé.");
        setId(storedId);

        // Récupération des catégories
        const categoriesResponse = await Recherche();
        if (categoriesResponse?.data?.data) {
          const categories = categoriesResponse.data.data.map(
            (item) => item.label
          );
          setArrayData(categories);
        } else {
          throw new Error("Erreur lors de la récupération des catégories.");
        }

        // Récupération des données du produit
        const produitResponse = await GetProduitById(storedId);
        if (produitResponse?.data?.data) {
          console.log(produitResponse?.data?.data);

          const produit = produitResponse.data.data;
          setLibelle(produit.label);
          setPrix(produit.unit_price);
          setDescription(produit.description);
          setCategorie(produit.categoryId);
          setImages(produit.images || []);
        } else {
          throw new Error("Produit introuvable.");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        toast.error(error.message || "Erreur inconnue.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSubmit = async () => {
    try {
      const categorieId = arrayData.indexOf(categorie) + 1;
      const formData = new FormData();

      formData.append("label", libelle);
      formData.append("unit_price", prix);
      formData.append("description", description);
      formData.append("categoryId", parseInt(categorieId));
      if (Array.isArray(images)) {
        images.forEach((image) => {
          formData.append("images", image); // Chaque image doit être un objet File
        });
      } else {
        formData.append("images", images); // Si images est déjà un seul fichier, l'ajouter directement
      }
      console.log("type");
      logFormDataTypes(formData);

      const result = await modification_produit({ id, formData });
      if (result.success) {
        toast.success("Produit modifié avec succès.");
        sessionStorage.removeItem("id_produit_modifier");
        router.push("/produit");
      } else {
        throw new Error(result.message || "Erreur lors de la modification.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      toast.error(error.message || "Erreur inconnue.");
    }
  };

  return (
    <div className="p-6">
      <Card title="Modification du produit">
        {isLoading ? (
          <p className="text-center text-gray-500">Chargement...</p>
        ) : (
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
            <div className="grid grid-cols-1 gap-4">
              <Textinput
                label="Libellé"
                type="text"
                placeholder="Libellé"
                defaultValue={libelle}
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
              />
              <Textinput
                label="Prix"
                type="number"
                defaultValue={prix}
                placeholder="Prix du produit"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
              />
              <Select
                options={arrayData}
                label="Catégorie du produit"
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
              />
              <Textarea
                label="description"
                type="text"
                placeholder={description}
                rows="4"
                value={description}
                defaultValue={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <Card>
                <Imageinput
                  onChange={(files) => setImages(files)}
                  defaultValue={images}
                />
              </Card>
            </div>
          </div>
        )}
        <div className="text-right mt-6 space-x-4">
          <Button
            text="Annuler"
            className="btn-warning bg-orange-500"
            onClick={() => router.push("/produit")}
            disabled={isLoading}
          />
          <Button
            text="Modifier"
            className="btn-success"
            onClick={handleSubmit}
            disabled={isLoading}
          />
        </div>
      </Card>
    </div>
  );
};

export default FormulaireModificationProduit;
