"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Imageinput from "@/components/ui/ImageInput";
import { Recherche } from "./categorie";
import { toast } from "react-toastify";
import { AjouterProduit } from "./apiAjout";
import { useRouter } from "next/navigation";

const Produits = () => {
  const [arraydata, SetArraydata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [Libelle, setLibelle] = useState("");
  const [description, setDescription] = useState("");
  const [categorie, setCategorie] = useState();
  const [images, setImage] = useState();
  const [prix, setPrix] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const Data = await Recherche();
      if (Data) {
        const Arraylabel = Data["data"]["data"].map((item) => item.label);
        console.log(Arraylabel);
        SetArraydata(Arraylabel);
      }
    };

    getData();
    setIsLoading(false);
  }, []);


  const handleSubmit = async () => {
     const categorieId = (arraydata.indexOf(categorie) + 1);

    const formData = new FormData();

    formData.append("label", Libelle);
    formData.append("unit_price", prix);
    formData.append("description", description);
    formData.append("categoryId", categorieId);
    images.forEach((image) => {
        formData.append("images", image);
      });
  
    const result = await AjouterProduit(formData);
    if (result.success) {
      toast.success("Produit ajouter avec succes");
    } else {
      console.log(result.message)
      toast.error(`erreur ${result.message}`);
    }


  };

  return (
    <div>
      <Card title="Ajouter un nouveau produit">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <Textinput
              label="Libellé"
              type="text"
              placeholder="Libellé"
              value={Libelle}
              onChange={(e) => setLibelle(e.target.value)}
              
            />
            <Textinput
              label="Prix"
              type="number"
              placeholder="Prix du produit"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
            />
            <Select
              options={arraydata}
              label="categorie du produit"
              className="w-full"
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
            />
            <div className="lg:col-span-2 col-span-1">
              <Textarea
                label="Description"
                type="text"
                placeholder="Description du produit"
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="grid  gap-4">
            <Card>
              <Imageinput onChange={(File) => setImage(File)} />
            </Card>

          </div>
        </div>
        <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
          <Button
            text="Annuler"
            className="btn-warning bg-orange-500 "
            onClick={() => {
              router.push("/produit");
            }}
          />
          <Button
            text="Ajouter"
            className="btn-success "
            onClick={handleSubmit}
            disabled={isLoading}
          />
        </div>
      </Card>
    </div>
  );
};

export default Produits;
